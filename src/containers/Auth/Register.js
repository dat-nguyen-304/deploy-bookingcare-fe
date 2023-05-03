import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { withRouter } from 'react-router-dom';
import { LANGUAGES } from '../../utils/constant';
import CommonUtils from '../../utils/CommonUtils';
import { changeLanguageApp } from '../../store/actions/appActions';
import { createUser } from '../../services/adminService';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { FormattedMessage } from 'react-intl';
import './Register.scss';

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {
            allGender: [],
            imgUrl: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            positionId: '',
            roleId: '',
            avatar: '',
            isOpen: false,
        }
    }

    componentDidMount () {
        this.props.getGenderStart();
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                allGender: this.props.genders,
                gender: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : ''
            })
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    handleChangeInput = (event, key) => {
        this.setState({
            [key]: event.target.value
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

    checkValidInput () {
        let keys = ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber', 'address', 'gender', 'avatar'];
        for (let i = 0; i < keys.length; i++) {
            if (!this.state[keys[i]]) {
                toast.error('Must enter ' + keys[i]);
                return false;
            }
        }
        if (this.state.password !== this.state.confirmPassword) {
            toast.error('Two passwords do not match!');
            return false;
        }
        return true;
    }

    registerNewUser = async () => {
        if (this.checkValidInput()) {
            let res = await createUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                roleId: "R3",
                avatar: this.state.avatar,
            })
            if (res && res.errCode === 0) {
                toast.success('Add new user successfully');
            } else {
                toast.error(res.errMessage);
            }
        }
    }

    render () {
        let { allGender, imgUrl, isOpen, email, password, confirmPassword, firstName, lastName, phoneNumber, address, gender } = this.state;
        let { language } = this.props;
        return (
            <div className="register-wrapper" >
                <div class="form">
                    <div class="form-container">
                        <div className="languages">
                            <span className={ this.props.language === LANGUAGES.VI ? "active" : "" } onClick={ () => this.changeLanguage(LANGUAGES.VI) }>VN</span>
                            <span className={ this.props.language === LANGUAGES.EN ? "active" : "" } onClick={ () => this.changeLanguage(LANGUAGES.EN) }>EN</span>
                        </div>
                        <h1 class="form__title"><FormattedMessage id="manage-user.register" /></h1>
                        <div className="row">
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input type="text" value={ email } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'email') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input type="password" value={ password } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'password') } />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.confirm-password" /></label>
                                <input type="password" value={ confirmPassword } className="form-control" onChange={ (event) => this.handleChangeInput(event, 'confirmPassword') } />
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
                            <div className="col-6">
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
                                <label><FormattedMessage id="manage-user.avatar" /></label>
                                <input type="file" id="upload-user-img" hidden onChange={ this.getImgUrl } />
                                <div className="upload-img-container">
                                    <label htmlFor="upload-user-img" className="upload-img btn btn-dark">Tải anh lên</label>
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
                            <div className="form__control">
                                <button class="form__submit-btn" type="submit" onClick={ this.registerNewUser }><FormattedMessage id="manage-user.register" /></button>
                                <div class="form__link" onClick={ () => this.props.history.push('/login') }><FormattedMessage id="manage-user.back-to-login" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
