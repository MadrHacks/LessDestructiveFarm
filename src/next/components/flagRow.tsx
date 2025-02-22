import moment from 'moment';
import React, { StatelessComponent } from 'react';
import FlagModel from '../../lib/models/flag';

interface Props {
  flag: FlagModel;
}

const FlagRow: StatelessComponent<Props> = ({ flag }) => (
  <tr>
    <th scope="row">{flag.exploit}</th>
    <td>{flag.team}</td>
    <td>{flag.service}</td>
    <td>{flag.flag}</td>
    <td>{moment(flag.timestamp).format('HH:mm:ss')}</td>
    <td>{flag.tick}</td>
    <td>{flag.status}</td>
    <td>{flag.checksystem_response}</td>
  </tr>
);

export default FlagRow;
