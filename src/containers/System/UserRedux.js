import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils/constant';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { createUser, deleteUser, editUser } from '../../services/adminService';
import { CRUD_ACTION } from '../../utils/constant';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersTable from './UsersTable';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions';
import CommonUtils from '../../utils/CommonUtils';

class UserRedux extends Component {

    state = {
        allGender: [],
        allPosition: [],
        allRole: [],
        isOpen: false,
        imgUrl: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        positionId: '',
        roleId: '',
        avatar: '',
        action: CRUD_ACTION.CREATE,
        isLoading: false
    }

    componentDidMount () {
        this.setState({
            isLoading: true,
        })
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        this.props.getAllUserStart();
        this.setState({
            isLoading: false,
        })
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                allGender: this.props.genders,
                gender: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : ''
            })
        }

        if (prevProps.positions !== this.props.positions) {
            this.setState({
                allPosition: this.props.positions,
                positionId: this.props.positions && this.props.positions.length > 0 ? this.props.positions[0].keyMap : ''
            })
        }

        if (prevProps.roles !== this.props.roles) {
            this.setState({
                allRole: this.props.roles,
                roleId: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0].keyMap : ''
            })
        }
    }

    resetInput = () => {
        this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : '',
            positionId: this.props.positions && this.props.positions.length > 0 ? this.props.positions[0].keyMap : '',
            roleId: this.props.roles && this.props.roles.length > 0 ? this.props.roles[0].keyMap : '',
            action: CRUD_ACTION.CREATE,
            imgUrl: '',
        })
    }

    changeFormUpdate = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: '*******',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            positionId: user.positionId,
            roleId: user.roleId,
            action: CRUD_ACTION.UPDATE,
            imgUrl: imageBase64
        })
    }

    getImgUrl = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                imgUrl: objectUrl,
                avatar: base64
            })
        }
    }

    openLightbox = () => {
        if (this.state.imgUrl) {
            this.setState({
                isOpen: true,
            })
        }
    }

    handleChangeInput = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    checkValidInput () {
        let keys = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address', 'gender', 'positionId', 'avatar'];
        for (let i = 0; i < keys.length; i++) {
            if (!this.state[keys[i]]) {
                toast.error('must enter ' + keys[i]);
                return false;
            }
        }
        return true;
    }

    handleDeleteUser = async (userId) => {
        try {
            let data = { data: { id: userId } };
            let response = await deleteUser(data);
            if (response && response.errCode === 0) {
                this.success('Delete user successfully')
                this.props.getAllUserStart();
            } else {
                toast.error(response.errMessage);
            }
        } catch (e) {
            console.log('>>> catch: ' + e);
        }
    }

    handleEditUser = async () => {
        try {
            let res = await editUser({
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                positionId: this.state.positionId,
                roleId: this.state.roleId,
                avatar: this.state.avatar,
            });
            if (res && res.errCode !== 0) {
                toast.error(res.errMessage);
            } else {
                toast.success('Update user successfully');
                this.props.getAllUserStart();
                this.resetInput();
            }
        } catch (e) {
            console.log('>>> catch: ' + e);
        }
    }

    createUser = async () => {
        if (this.checkValidInput()) {
            let res = await createUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                positionId: this.state.positionId,
                roleId: this.state.roleId,
                avatar: this.state.avatar,
            })
            if (res && res.errCode === 0) {
                this.props.getAllUserStart();
                this.resetInput();
                toast.success('Add new user successfully');
            } else {
                toast.error(res.errMessage);
            }
        }
    }

    render () {
        let { language } = this.props;
        let { allGender, allPosition, allRole, imgUrl, isOpen, email, password, firstName, lastName, phoneNumber, address, gender, positionId, roleId, action } = this.state;
        return (
            <>
                <div className="title" ><FormattedMessage id="manage-user.manage-account" /></div>
                <div className="manage-user-container">
                    <div>
                        <div className="row">
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input disabled={ action === CRUD_ACTION.UPDATE } type="text" value={ email } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'email') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input disabled={ action === CRUD_ACTION.UPDATE } type="text" value={ password } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'password') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input type="text" value={ firstName } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'firstName') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input type="text" value={ lastName } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'lastName') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input type="text" value={ phoneNumber } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'phoneNumber') } />
                            </div>
                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input type="text" value={ address } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'address') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select value={ gender } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'gender') }>
                                    { allGender &&
                                        allGender.map((gender, index) => {
                                            return (
                                                <option key={ index } value={ gender.keyMap }>{ language === LANGUAGES.VI ? gender.valueVi : gender.valueEn }</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select value={ roleId } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'roleId') }>
                                    { allRole &&
                                        allRole.map((role, index) => {
                                            return (
                                                <option key={ index } value={ role.keyMap }>{ this.props.language === LANGUAGES.VI ? role.valueVi : role.valueEn }</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                { roleId === 'R2' &&
                                    <>
                                        <label><FormattedMessage id="manage-user.position" /></label>
                                        <select value={ positionId } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'positionId') }>
                                            { allPosition &&
                                                allPosition.map((position, index) => {
                                                    return (
                                                        <option key={ index } value={ position.keyMap }>{ this.props.language === LANGUAGES.VI ? position.valueVi : position.valueEn }</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </>
                                }
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.avatar" /></label>
                                <input type="file" id="upload-user-img" hidden onChange={ this.getImgUrl } />
                                <div className="upload-img-container">
                                    <label htmlFor="upload-user-img" className="upload-img btn btn-dark"><FormattedMessage id="manage-user.upload-avatar" /></label>
                                    {
                                        imgUrl &&
                                        <div className="upload-img-preview" style={ { backgroundImage: `url(${imgUrl})` } } onClick={ this.openLightbox }>
                                            { isOpen && (
                                                <Lightbox
                                                    mainSrc={ imgUrl }
                                                    onCloseRequest={ () => this.setState({ isOpen: false }) }
                                                />
                                            ) }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-12">
                                { action === CRUD_ACTION.CREATE ?
                                    <button type="submit" className="btn btn-primary btn-submit" onClick={ this.createUser }>
                                        <FormattedMessage id="manage-user.save" />
                                    </button>
                                    :
                                    <button type="submit" className="btn btn-warning btn-submit" onClick={ this.handleEditUser }>
                                        <FormattedMessage id="manage-user.update" />
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    <UsersTable changeFormUpdate={ this.changeFormUpdate } />
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        genders: state.admin.genders,
        positions: state.admin.positions,
        roles: state.admin.roles,
        users: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        getAllUserStart: () => dispatch(actions.fetchAllUserStart()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserRedux));
