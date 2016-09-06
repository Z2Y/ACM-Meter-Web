import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Tag, Icon, Button } from 'antd';
import StatusPoint from 'components/StatusPoint';
import SearchInput from 'components/SearchInput';
import * as articleActions from 'actions/entity/article';
import './style.less';

const columns = [{
  title: '标题',
  dataIndex: 'title',
  sorter: true
}, {
  title: '状态',
  dataIndex: 'status',
  render: status => {
    switch (status) {
      case 0:
        return <StatusPoint>回收站</StatusPoint>;
      case 1:
        return <StatusPoint color="light-blue">草稿</StatusPoint>;
      case 2:
        return <StatusPoint color="green">发布</StatusPoint>;
      case 3:
        return <StatusPoint color="red">置顶</StatusPoint>;
      default:
        return null;
    }
  }
}, {
  title: '类型',
  dataIndex: 'type',
  render: type => {
    switch (type) {
      case 'News':
        return <Tag color="blue">新闻</Tag>;
      case 'Solution':
        return <Tag color="green">解题报告</Tag>;
      default:
        return null;
    }
  }
}, {
  title: '正文',
  dataIndex: 'content'
}, {
  title: '作者',
  dataIndex: 'user.name'
}, {
  title: '创建时间',
  dataIndex: 'created_at'
}, {
  title: '操作',
  key: 'operation',
  render: (text, record) => (
    <span>
      <a href="#">修改</a>
      <span className="ant-divider"></span>
      <a href="#" className="ant-dropdown-link">
        更多 <Icon type="down" />
      </a>
    </span>
  ),
}];

class AdminArtcile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      selectedRowKeys: []
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSelectChange = (selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    };
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    this.props.fetchArticles();
  }

  onSearch(value) {
    const { pagination } = this.props;
    this.setState({ searchKey: value });
    this.props.fetchArticles({
      page: pagination.current,
      per: pagination.pageSize,
      search: value
    });
  }

  handleTableChange(pagination, filters, sorter) {
    const params = {
      page: pagination.current,
      per: pagination.pageSize,
      search: this.state.searchKey
    };
    if (sorter && sorter.field) {
      params.sort_field = sorter.field;
      params.sort_order = sorter.order;
    }
    this.props.fetchArticles({
      ...params,
      filters
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <div className="table-operations clear-fix">
          <Button type="primary">发布新闻</Button>
          <Button disabled={!hasSelected}>删除</Button>
          <div className="pull-right">
            <SearchInput onSearch={this.onSearch} style={{ width: 200 }} />
          </div>
        </div>
        <Table
          bordered onChange={this.handleTableChange}
          columns={columns} dataSource={this.props.articles}
          rowSelection={rowSelection} rowKey={record => record.id}
          pagination={this.props.pagination} loading={this.props.loading}
        />
      </div>
    );
  }
}

AdminArtcile.propTypes = {
  articles: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchArticles: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const articleState = state.entity.article;
  return {
    articles: articleState.data || [],
    pagination: {
      total: articleState.pagination.total_count,
      current: articleState.pagination.current_page,
      pageSize: articleState.pageSize
    },
    loading: articleState.waitFetch
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticles: bindActionCreators(articleActions.fetchArticles, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminArtcile);
