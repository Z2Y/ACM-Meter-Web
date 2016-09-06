import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Button, Tag } from 'antd';
import SearchInput from 'components/SearchInput';
import * as userActions from 'actions/entity/user';
import './style.less';

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  sorter: true,
  width: '10%',
  className: 'text-center',
  render: (name, record) => (
    <div>
      { name }<br />
      <Tag color="green">{ record.nickname }</Tag>
    </div>
  ),
}, {
  title: '性别',
  dataIndex: 'gender',
  render: isMale => (isMale ? '男' : '女'),
  width: '5%',
  className: 'text-center'
}, {
  title: '身份',
  dataIndex: 'role',
  width: '15%',
  render: (role) => {
    const isStudent = role & 1;
    const isCoach = role & 2;
    const isAdmin = role & 4;
    return (
      <div>
        {isStudent ? <Tag>学生</Tag> : null}
        {isCoach ? <Tag color="blue">教练</Tag> : null}
        {isAdmin ? <Tag color="red">管理员</Tag> : null}
      </div>
    );
  }
}, {
  title: '邮箱',
  dataIndex: 'email',
  width: '18%'
}, {
  title: '学院专业年级',
  key: 'student_info',
  render: (text, record) => (
    <div>
      {record.school}<br />
      {record.college}<br />
      {record.major} {record.grade}
    </div>
  )
}, {
  title: '创建时间',
  dataIndex: 'created_at'
}];

class AdminUser extends React.PureComponent {
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
    this.props.fetchUsers();
  }

  onSearch(value) {
    const { pagination } = this.props;
    this.setState({ searchKey: value });
    this.props.fetchUsers({
      page: pagination.current,
      per: pagination.pageSize,
      search: value
    });
  }

  handleTableChange(pagination, filters, sorter) {
    console.log(pagination, sorter, filters);
    const params = {
      page: pagination.current,
      per: pagination.pageSize,
      search: this.state.searchKey
    };
    if (sorter && sorter.field) {
      params.sort_field = sorter.field;
      params.sort_order = sorter.order;
    }
    this.props.fetchUsers({
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
          <Button disabled={!hasSelected}>删除</Button>
          <div className="pull-right">
            <SearchInput onSearch={this.onSearch} style={{ width: 200 }} />
          </div>
        </div>
        <Table
          bordered onChange={this.handleTableChange}
          columns={columns} dataSource={this.props.users}
          rowSelection={rowSelection} rowKey={record => record.id}
          pagination={this.state.pagination} loading={this.props.loading}
        />
      </div>
    );
  }
}

AdminUser.propTypes = {
  users: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchUsers: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const userState = state.entity.user;
  return {
    users: userState.datas || [],
    pagination: {
      total: userState.pagination.total_count,
      current: userState.pagination.current_page,
      pageSize: userState.pageSize
    },
    loading: userState.waitFetch
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: bindActionCreators(userActions.fetchUsers, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUser);
