import { IsDate, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Op } from 'sequelize';
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';
import Flag from '../models/flag';

@ArgsType()
class GetFlagsCountArgs {
  @IsOptional()
  @Field({ nullable: true })
  flag?: string;

  @IsOptional()
  @Field({ nullable: true })
  service?: string;

  @IsOptional()
  @Field({ nullable: true })
  exploit?: string;

  @IsOptional()
  @Field({ nullable: true })
  team?: string;

  @IsOptional()
  @Field({ nullable: true })
  tick?: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  since?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  until?: Date;

  @IsOptional()
  @Field({ nullable: true })
  status?: string;

  @IsOptional()
  @Field({ nullable: true })
  checksystem_response?: string;
}

@ArgsType()
class GetFlagsArgs extends GetFlagsCountArgs {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(type => Int, { defaultValue: 0 })
  offset: number = 0;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(type => Int, { defaultValue: 30 })
  limit: number = 30;
}
@ObjectType()
class SearchValues {
  @Field(type => [String])
  service: string[];

  @Field(type => [String])
  exploits: string[];

  @Field(type => [String])
  teams: string[];

  @Field(type => [String])
  statuses: string[];
}

@Resolver()
export class FlagResolver {
  static argumentsToQuery(args: GetFlagsCountArgs | GetFlagsArgs) {
    const { flag, service, exploit, team, tick, since, until, status, checksystem_response } = args;
    const search: any = {};

    if (flag) search.flag = { [Op.iLike]: '%' + flag + '%' };
    if (service) search.service = service;
    if (exploit) search.exploit = exploit;
    if (team) search.team = team;
    if (tick) search.tick = tick;
    if (status) search.status = status;
    if (checksystem_response)
      search.checksystem_response = { [Op.iLike]: '%' + checksystem_response + '%' };

    if (since && until) {
      search.timestamp = {
        [Op.and]: [{ [Op.gte]: since }, { [Op.lte]: until }]
      };
    } else if (since) {
      search.timestamp = {
        [Op.gte]: since
      };
    } else if (until) {
      search.timestamp = {
        [Op.lte]: until
      };
    }

    return search;
  }

  @Query(returns => [Flag])
  async getFlags(@Args() args: GetFlagsArgs): Promise<Flag[]> {
    const { offset, limit } = args;
    const search = FlagResolver.argumentsToQuery(args);

    const flags = await Flag.findAll({
      where: search,
      offset,
      limit,
      order: [['timestamp', 'DESC']]
    });

    return flags;
  }

  @Query(returns => Int)
  async getFlagCount(@Args() args: GetFlagsCountArgs): Promise<number> {
    const search = FlagResolver.argumentsToQuery(args);

    const count = await Flag.count({
      where: search
    });

    return count;
  }

  @Query(returns => SearchValues)
  async getSearchValues(): Promise<SearchValues> {
    const serviceRes: [{ DISTINCT: string }] = await Flag.aggregate('service', 'DISTINCT', {
      plain: false,
      raw: true
    });
    const services = [];
    for (const status of serviceRes) services.push(status.DISTINCT);

    const exploitRes: [{ DISTINCT: string }] = await Flag.aggregate('exploit', 'DISTINCT', {
      plain: false,
      raw: true
    });
    const exploits = [];
    for (const status of exploitRes) exploits.push(status.DISTINCT);

    const teamRes: [{ DISTINCT: string }] = await Flag.aggregate('team', 'DISTINCT', {
      plain: false,
      raw: true
    });
    const teams = [];
    for (const status of teamRes) teams.push(status.DISTINCT);

    const tickRes: [{ DISTINCT: number }] = await Flag.aggregate('tick', 'DISTINCT', {
      plain: false,
      raw: true
    });
    const ticks = [];
    for (const status of tickRes) ticks.push(status.DISTINCT);

    const statusRes: [{ DISTINCT: string }] = await Flag.aggregate('status', 'DISTINCT', {
      plain: false,
      raw: true
    });
    const statuses = [];
    for (const status of statusRes) statuses.push(status.DISTINCT);

    return { services, exploits, teams, statuses };
  }

  @Mutation(returns => Boolean)
  async postFlags(@Arg('flags', type => [String]) flags: string[]): Promise<boolean> {
    const flagsForInserion: any = [];

    for (const flag of flags) {
      flagsForInserion.push({
        flag: flag,
        exploit: 'MANUAL',
        team: 'MANUAL',
        timestamp: new Date()
      });
    }

    await Flag.bulkCreate(flagsForInserion, { ignoreDuplicates: true });
    return true;
  }
}
