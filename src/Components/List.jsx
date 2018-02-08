import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {getStandards, postStandard} from '../api';
import {subjects, bloomLevels, dokLevels} from '../data';
import Loader from '../UI/Loader';

const filterKeys = ['subjectTitle', 'title', 'bloomLevelTitle', 'description', 'teacherQuestion', 'studentQuestion'];

export default class List extends Component {
  state = {
    standards: [],
    filters: {
    },
    filterValue: '',
    page: 0,
    loading: true,
  }

  async componentDidMount() {
    const standardsResponse = await getStandards();
    this.setState({
      standards: standardsResponse,
      loading: false,
    });
  }

  handleCreateStandard = async () => {
    this.setState({
      loading: true,
    });
    const standard = await postStandard(createStandard());
    browserHistory.push(`/standard/${standard.id}`);
  }

  handleChangeFilterValue = (e) => {
    this.setState({
      filterValue: e.target.value,
      page: 0,
    });
  }

  render() {
    if (this.state.loading) return <Loader />;

    const {standards, filters, filterValue: unpreparedFilterValue} = this.state;
    const filterValue = unpreparedFilterValue.toLowerCase();
    const {page} = this.state;

    const filtered = applyFilters(
      standards.map(standard => {
        const bloomLevelTitle = standard.bloomLevel
          ? bloomLevels[standard.bloomLevel - 1].title
          : ''
        const dokLevel = standard.DOKLevel
          ? standard.DOKLevel.toString()
          : ''
        const title = standard.title
          ? standard.title
          : ''
        const subjectTitle = standard.subjectId
          ? subjects[standard.subjectId - 1].title
          : ''
        return {
          ...standard,
          bloomLevelTitle,
          subjectTitle,
          title,
          dokLevel,
        }
      }), filters, filterKeys, filterValue, {page, count: 10});

    return <div>
      <div className="form-group">
        <div className="btn-toolbar">
          <button onClick={this.handleCreateStandard} className="btn btn-primary">Create standard {'>>'}</button>
        </div>
      </div>
      <div className="form-group">
        <input type="text" className="form-control" value={unpreparedFilterValue} onChange={this.handleChangeFilterValue} placeholder="Filter..."/>
      </div>
      <Paginator onChange={(page) => this.setState({page})} page={page} pageCount={filtered.pageCount}/>
      <table className="table table-hover table-striped table-bordered table-responsive">
        <thead>
        <tr>
          <th width="80">Subject!</th>
          <th width="110">Standard</th>
          <th width="40">DOK Level</th>
          <th width="80">Bloom's Level</th>
          <th width="2*">Essential Skills</th>
          <th width="1*">Content Focus Questions</th>
          <th width="1*">Student Exploration: Question/Discussion Stems</th>
        </tr>
        </thead>
        <tbody>
        {filtered.items
          .map(standard => {
            return <tr key={standard.id} style={{cursor: 'pointer'}} onClick={() => browserHistory.push(`/standard/${standard.id}`)}>
            <td>
              <HighLight filter={filterValue} placeholder="No subject">{standard.subjectTitle}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No title">{standard.title}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No level">{standard.dokLevel}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No level">{standard.bloomLevelTitle}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No description">{standard.description}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No questions">{standard.teacherQuestion}</HighLight>
            </td>
            <td>
              <HighLight filter={filterValue} placeholder="No questions">{standard.studentQuestion}</HighLight>
            </td>
          </tr>
        })}
        </tbody>
      </table>
      <Paginator onChange={(page) => this.setState({page})} page={page} pageCount={filtered.pageCount}/>
    </div>
  }
}

const HighLight = ({children, filter, placeholder}) => {
  if (!children) return <span className="text-muted">{placeholder}</span>;
  const __html = children.replace(new RegExp('(' + filter + ')', 'gi'), '<span class="bg-danger">$1</span>');
  return <span dangerouslySetInnerHTML={{__html}}/>
};

function applyFilters(arr, filters, filterKeys, filterValue, {count, page}) {
  const items = arr
    .filter(item => {
      return Object
          .keys(filters)
          .every(key => filters[key]
            .some(val => item[key] === val)
          ) && (filterValue === '' || filterKeys
          .some(key => {
            if (!item[key]) return false;
            return item[key].toLowerCase().includes(filterValue)
          }))
    });
  return {
    items: items.filter((_, ind) => (page * count <= ind && ind < (page + 1) * count)), // Paginate
    pageCount: Math.ceil(items.length / count),
  };
}

const Paginator = ({page, onChange, pageCount}) => {
  const handleMinus = () => {
    if (page > 0) onChange(page - 1);
  };
  const handlePlus = () => {
    if (page < pageCount - 1) onChange(page + 1);
  };
  if (pageCount === 0) return <ul className="pagination">
    <li className="disabled"><a >1</a></li>
    <li className="disabled"><a >{'<'}</a></li>
    <li className="disabled"><span>No items</span></li>
    <li className="disabled"><a >{'>'}</a></li>
  </ul>
  return <ul className="pagination">
    <li className={page === 0 ? 'disabled' : ''}><a  onClick={() => onChange(0)}>1</a></li>
    <li className={page === 0 ? 'disabled' : ''}><a onClick={handleMinus}>{'<'}</a></li>
    <li className="disabled"><span>Page {page + 1} of {pageCount}</span></li>
    <li className={page >= pageCount - 1 ? 'disabled' : ''}><a onClick={handlePlus}>{'>'}</a></li>
  </ul>
};

function createStandard() {
  return {
    subjectId: 1,
    domainId: '',
    title: '',
    description: '',
    unitId: null,
    keywords: [],
    DOKLevel: 1,
    bloomLevel: 1,
    teacherQuestion: '',
    studentQuestion: '',
  };
}
