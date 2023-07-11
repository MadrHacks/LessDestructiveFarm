import moment from 'moment';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { GameInfo, SearchParams, SearchValues } from '../lib/types';

interface Props {
  gameInfo: GameInfo;
  searchParams: SearchParams;
  searchValues: SearchValues;
  onSearch: (params: any) => any;
  onReset: () => any;
}

interface State {
  service: string;
  exploit: string;
  team: string;
  status: string;
  flag: string;
  tick: string;
  since?: Date;
  until?: Date;
  checksystemResponse: string;
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      service: props.searchParams.service || '',
      exploit: props.searchParams.exploit || '',
      team: props.searchParams.team || '',
      status: props.searchParams.status || '',
      flag: props.searchParams.flag || '',
      tick: props.searchParams.tick || '',
      since: props.searchParams.since && new Date(props.searchParams.since),
      until: props.searchParams.until && new Date(props.searchParams.until),
      checksystemResponse: props.searchParams.checksystem_response || ''
    };

    this.onSelectService = this.onSelectService.bind(this);
    this.onSelectExploit = this.onSelectExploit.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
    this.onSelectTick = this.onSelectTick.bind(this);
    this.onSelectStatus = this.onSelectStatus.bind(this);
    this.onTextInputChanged = this.onTextInputChanged.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    //If searchParams object changed (needed for update on navigation)
    if (this.props.searchParams !== prevProps.searchParams)
      this.setState({
        service: this.props.searchParams.service || '',
        exploit: this.props.searchParams.exploit || '',
        team: this.props.searchParams.team || '',
        status: this.props.searchParams.status || '',
        flag: this.props.searchParams.flag || '',
        tick: this.props.searchParams.tick || '',
        since: this.props.searchParams.since && new Date(this.props.searchParams.since),
        until: this.props.searchParams.until && new Date(this.props.searchParams.until),
        checksystemResponse: this.props.searchParams.checksystem_response || ''
      });
  }


  onSelectService(event: any) {
    this.setState({
      service: event.target.value
    });
  }
  onSelectExploit(event: any) {
    this.setState({
      exploit: event.target.value
    });
  }
  onSelectTeam(event: any) {
    this.setState({
      team: event.target.value
    });
  }
  onSelectTick(event: any) {
    this.setState({
      tick: event.target.value
    });
  }
  onSelectStatus(event: any) {
    this.setState({
      status: event.target.value
    });
  }
  onDateChanged(field: string, date: Date) {
    if (field === 'since') this.setState({ since: date });
    else if (field === 'until') this.setState({ until: date });
  }
  onTextInputChanged(event: any) {
    if (event.target.id === 'flag') this.setState({ flag: event.target.value });
    else if (event.target.id === 'checksystemResponse')
      this.setState({ checksystemResponse: event.target.value });
  }

  onResetClick() {
    this.setState({
      service: '',
      exploit: '',
      team: '',
      tick: '',
      status: '',
      flag: '',
      since: undefined,
      until: undefined,
      checksystemResponse: ''
    });

    this.props.onReset();
  }

  onSearchClick() {
    const payload: any = {};

    payload.service = this.state.service;
    payload.exploit = this.state.exploit;
    payload.team = this.state.team;
    payload.tick = this.state.tick;
    payload.status = this.state.status;
    payload.flag = this.state.flag;
    payload.since = this.state.since ? moment(this.state.since).format('HH:mm') : '';
    payload.until = this.state.until ? moment(this.state.until).format('HH:mm') : '';
    payload.checksystem_response = this.state.checksystemResponse;

    this.props.onSearch(payload);
  }

  render() {
    return (
      <div className="col-lg-8">
        <div className="card border-light">
          <div className="card-body">
            <h4 className="card-title">Show Flags</h4>
            <div className="row mb-2">
              <div className="col-md-4">
                <label>Service</label>
                <select
                  className="form-control form-control-sm"
                  onChange={this.onSelectService}
                  value={this.state.service}
                >
                  <option value="">All</option>
                  {this.props.searchValues.services.map((value, i) => {
                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <label>Exploit</label>
                <select
                  className="form-control form-control-sm"
                  onChange={this.onSelectExploit}
                  value={this.state.exploit}
                >
                  <option value="">All</option>
                  {this.props.searchValues.exploits.map((value, i) => {
                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <label>Team</label>
                <select
                  className="form-control form-control-sm"
                  onChange={this.onSelectTeam}
                  value={this.state.team}
                >
                  <option value="">All</option>
                  {this.props.searchValues.teams.map((value, i) => {
                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <label>Flag</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={this.state.flag}
                  id="flag"
                  onChange={this.onTextInputChanged}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <label>Since</label>
                <div>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={this.state.since}
                    onChange={date => this.onDateChanged('since', date)}
                    timeInputLabel="Time:"
                    dateFormat="HH:mm"
                    showTimeInput={true}
                    shouldCloseOnSelect={false}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label>Until</label>
                <div>
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={this.state.until}
                    onChange={date => this.onDateChanged('until', date)}
                    timeInputLabel="Time:"
                    dateFormat="HH:mm"
                    showTimeInput={true}
                    shouldCloseOnSelect={false}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label>Tick</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={this.state.tick}
                  id="tick"
                  onChange={this.onTextInputChanged}
                />
              </div>
              <div className="col-md-2">
                <label>Status</label>
                <select
                  className="form-control form-control-sm"
                  onChange={this.onSelectStatus}
                  value={this.state.status}
                >
                  <option value="">All</option>
                  {this.props.searchValues.statuses.map((value, i) => {
                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <label>Checksystem response</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={this.state.checksystemResponse}
                  id="checksystemResponse"
                  onChange={this.onTextInputChanged}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button className="btn btn-primary btn-sm submit-btn" onClick={this.onSearchClick}>
                  Search
                </button>
                &nbsp;
                <button className="btn btn-primary btn-sm submit-btn" onClick={this.onResetClick}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
