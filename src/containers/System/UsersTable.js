import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { deleteUser } from '../../services/adminService';
import * as actions from '../../store/actions';
import { toast } from 'react-toastify';
import './UsersTable.scss';
class UsersTable extends Component {

    state = {
    };

    componentDidMount () {
        this.props.getAllUserStart();
    }

    handleDeleteUser = async (userId) => {
        try {
            let data = { data: { id: userId } };
            let response = await deleteUser(data);
            if (response && response.errCode === 0) {
                toast.success('Delete user successfully')
                this.props.getAllUserStart();
            } else {
                toast.error(response.errMessage);
            }
        } catch (e) {
            console.log('>>> catch: ' + e);
        }
    }

    render () {
        let { users } = this.props;
        return (
            <>
                <table id="users">
                    <tbody>
                        <tr>
                            <th><FormattedMessage id="manage-user.email" /></th>
                            <th><FormattedMessage id="manage-user.first-name" /></th>
                            <th><FormattedMessage id="manage-user.last-name" /></th>
                            <th><FormattedMessage id="manage-user.address" /></th>
                            <th><FormattedMessage id="manage-user.action" /></th>
                        </tr>

                        {
                            users && users.length > 0 &&
                            users.map((user) => (
                                <tr key={ user.id }>
                                    <td>{ user.email }</td>
                                    <td>{ user.firstName }</td>
                                    <td>{ user.lastName }</td>
                                    <td>{ user.address }</td>
                                    <td>
                                        <button onClick={ () => this.props.changeFormUpdate(user) }><i className="fas fa-pencil-alt"></i></button>
                                        <button onClick={ () => this.handleDeleteUser(user.id) }><i className="fas fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUserStart: () => dispatch(actions.fetchAllUserStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
