import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { getStandard, updateStandard } from '../api';
import {subjects, bloomLevels, dokLevels} from '../data';
import Loader from '../UI/Loader';

export default class Standard extends Component {
  state = {
    standard: {
      subjectId: 3,
      domainId: 'HS-LS4',
      title: 'HS-LS4-6',
      description: 'Create or revise a simulation to test a solution to mitigate adverse impacts of human activity on biodiversity.',
      unitId: null,
      keywords: [],
      DOKLevel: 3,
      bloomLevel: 6,
    },
    loading: true,
    error: '',
  }

  async componentDidMount() {
    const {standardId} = this.props.params;
    const standard = await getStandard(standardId);
    if (standard !== null) {
      this.setState({
        standard,
        loading: false,
      });
    }
    else {
      this.setState({
        error: 'Standard not found',
      });
    }
  }

  handleChangeStandard = (prop) => (e) => {
    const {standard} = this.state;
    this.setState({
      standard: {
        ...standard,
        [prop]: e.target.value,
      },
    });
  }

  handleChangeStandardInt = (prop) => (e) => {
    const {standard} = this.state;
    this.setState({
      standard: {
        ...standard,
        [prop]: parseInt(e.target.value, 10),
      },
    });
  }

  handleChangeKeywords = (keywords) => {
    const {standard} = this.state;
    this.setState({
      standard: {
        ...standard,
        keywords,
      },
    });
  }

  handleSave = async() => {
    const {standard} = this.state;
    this.setState({
      loading: true,
    })
    const updated = await updateStandard(standard);
    this.setState({
      standard: updated,
      loaded: false,
    });
    browserHistory.push('/');
  }

  handleClose = async() => {
    browserHistory.push('/');
  }

  render() {
    if (this.state.loading) return <Loader />;

    const {
      standard: {
        subjectId,
        domainId,
        title,
        description,
        unitId,
        keywords,
        DOKLevel,
        bloomLevel,
        teacherQuestion,
        studentQuestion,
      },
      error,
    } = this.state;

    if (error) return <h1>Error! {error}</h1>

    return <div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-4">
            <label>Subject:</label>
            <select className="form-control" onChange={this.handleChangeStandardInt('subjectId')} value={subjectId}>
              {subjects.map(subject =>
                <option value={subject.id} key={subject.id}>{subject.title}</option>
              )}
            </select>
          </div>
          <div className="col-sm-4">
            <label>DOK Level:</label>
            <select className="form-control" onChange={this.handleChangeStandardInt('DOKLevel')} value={DOKLevel}>
              {dokLevels.map(level =>
                <option value={level.id} key={level.id}>Level {level.id} - {level.title}</option>
              )}
            </select>
          </div>
          <div className="col-sm-4">
            <label>Bloom Level:</label>
            <select className="form-control" onChange={this.handleChangeStandardInt('bloomLevel')} value={bloomLevel}>
              {bloomLevels.map(level =>
                <option value={level.id} key={level.id}>{level.title}</option>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input
          className="form-control"
          type="text" value={title}
          onChange={this.handleChangeStandard('title')}
          placeholder="Title (RS.A.1)..."
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          className="form-control"
          value={description}
          onChange={this.handleChangeStandard('description')}
          placeholder="Description..."
        />
      </div>
      <div className="form-group">
        <label>Teacher question:</label>
        <textarea
          className="form-control"
          value={teacherQuestion}
          onChange={this.handleChangeStandard('teacherQuestion')}
          placeholder="Teacher question..."
        />
      </div>
      <div className="form-group">
        <label>Student question:</label>
        <textarea
          className="form-control"
          value={studentQuestion}
          onChange={this.handleChangeStandard('studentQuestion')}
          placeholder="Student question..."
        />
      </div>
      <div className="form-group">
        <div className="panel panel-default">
          <div className="panel-heading">
            <label>Keywords:</label>
            <ListEdit items={keywords} onChange={this.handleChangeKeywords} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="btn-toolbar">
          <button className="btn btn-success" onClick={this.handleSave}>Save & Close</button>
          <button className="btn btn-warning" onClick={this.handleClose}>Close</button>
        </div>
      </div>
    </div>
  }
}

class ListEdit extends Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  state = {
    tmpItem: '',
  }

  handleChangeItem = (index) => (e) => {
    const {onChange, items} = this.props;
    onChange(items.map((item, i) => i === index
      ? e.target.value
      : item
    ));
  }

  handleAddItem = () => {
    const {onChange, items} = this.props;
    const {tmpItem} = this.state;
    onChange([...items, tmpItem]);
    this.setState({
      tmpItem: '',
    });
  }

  handleChangeTmpItem = (e) => {
    this.setState({
      tmpItem: e.target.value,
    });
  }

  handleDeleteItem = (index) => () => {
    const {onChange, items} = this.props;
    onChange(items.filter((_, i) => i !== index));
  }

  render() {
    const {items} = this.props;
    const {tmpItem} = this.state;

    return <div className="list-group" style={{marginBottom: 0 }}>
      {items.map((item, i) =>
        <div className="input-group form-group" key={i} style={{float: 'left', width: '200px', marginRight: '15px'}}>
          <input
            type="text"
            className="form-control"
            value={item}
            onChange={this.handleChangeItem(i)}
            placeholder="Keyword..."
          />
          <span className="input-group-btn">
            <button className="btn btn-danger" type="button" onClick={this.handleDeleteItem(i)}>&times;</button>
          </span>
        </div>
      )}
      <div className="clearfix"></div>
      <form onSubmit={(e) => {
        e.preventDefault();
        this.handleAddItem();
      }}>
        <div className="input-group form-group" style={{width: '200px'}}>
          <input
            type="text"
            className="form-control"
            value={tmpItem}
            onChange={this.handleChangeTmpItem}
            placeholder="Keyword..."
          />
          <span className="input-group-btn">
            <button className="btn btn-success" type="button" onClick={this.handleAddItem}>+</button>
          </span>
        </div>
      </form>
    </div>
  }
}
