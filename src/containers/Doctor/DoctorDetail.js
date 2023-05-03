import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createMarkDown, updateMarkDown, createDoctorInfo, updateDoctorInfo } from '../../services/adminService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select'
import { CRUD_ACTION, LANGUAGES } from '../../utils/constant';
import { getDetailDoctorById } from '../../services/adminService';
const mdParser = new MarkdownIt();

class DoctorManage extends Component {

    state = {
        doctorId: 0,
        contentMarkDown: '',
        contentHTML: '',
        description: '',
        allPayment: [],
        allPrice: [],
        allProvince: [],
        allSpecialty: [],
        selectedPrice: null,
        selectedPayment: null,
        selectedProvince: null,
        selectedSpecialty: null,
        clinicName: '',
        clinicAddress: '',
        note: '',
        action: CRUD_ACTION.CREATE,
    }
    componentDidMount () {
        this.props.fetchAllDoctorInfoCode();
        this.props.fetchAllSpecialty();
        this.setState({
            doctorId: this.props.userInfo.id
        })
        this.getDoctorInfo();
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.allPrice !== this.props.allPrice || prevProps.language !== this.props.language) {
            this.getAllOptions();
        }
    }

    getAllOptions = () => {
        let { allPrice, allProvince, allPayment, language, allSpecialty } = this.props;
        let { selectedPrice, selectedPayment, selectedProvince } = this.state;
        allPrice = allPrice.map((price) => {
            const label = language === LANGUAGES.VI ?
                new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(price.valueVi)
                :
                new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(price.valueEn);
            if (selectedPrice && price.keyMap === selectedPrice.value) {
                selectedPrice = {
                    ...selectedPrice,
                    label: label,
                }
            }
            return {
                label: label,
                value: price.keyMap
            }
        })

        allProvince = allProvince.map((province) => {
            const label = language === LANGUAGES.VI ? province.valueVi : province.valueEn;
            if (selectedProvince && province.keyMap === selectedProvince.value) {
                selectedProvince = {
                    ...selectedProvince,
                    label: label,
                }
            }
            return {
                label: label,
                value: province.keyMap
            }
        })

        allPayment = allPayment.map((payment) => {
            const label = language === LANGUAGES.VI ? payment.valueVi : payment.valueEn;
            if (selectedPayment && payment.keyMap === selectedPayment.value) {
                selectedPayment = {
                    ...selectedPayment,
                    label: label,
                }
            }
            return {
                label: label,
                value: payment.keyMap
            }
        })

        allSpecialty = allSpecialty.map((specialty) => {
            return {
                label: specialty.name,
                value: specialty.id,
            }
        })

        this.setState({
            allPayment,
            allPrice,
            allProvince,
            allSpecialty,
            selectedPrice,
            selectedPayment,
            selectedProvince,
        })
    }

    handleSaveContentMarkDown = async () => {
        let { doctorId, contentHTML, contentMarkDown, description, selectedPayment, selectedPrice, selectedProvince, selectedSpecialty, clinicAddress, clinicName, note } = this.state;
        if (contentHTML && contentMarkDown && description && selectedPayment && selectedPrice && selectedProvince) {
            let resMarkDown = await createMarkDown({
                doctorId: doctorId,
                contentHTML: contentHTML,
                contentMarkDown: contentMarkDown,
                description: description,
            })
            let resDoctorInfo = await createDoctorInfo({
                doctorId: doctorId,
                priceId: selectedPrice.value,
                provinceId: selectedProvince.value,
                paymentId: selectedPayment.value,
                nameClinic: clinicName,
                addressClinic: clinicAddress,
                note: note,
                specialtyId: selectedSpecialty.value,
            })
            if (resMarkDown && resMarkDown.errCode === 0 && resDoctorInfo && resDoctorInfo.errCode === 0) {
                toast.success('Add new doctor info successfully');
                this.setState({

                    action: CRUD_ACTION.UPDATE,
                })
            } else {
                toast.error('Something wrong');
            }
        } else {
            toast.error('Invalid parameters');
        }
    }

    handleUpdateContentMarkDown = async () => {
        let { doctorId, contentHTML, contentMarkDown, description, selectedPayment, selectedPrice, selectedProvince, selectedSpecialty, clinicAddress, clinicName, note } = this.state;
        let resMarkDown = await updateMarkDown({
            contentHTML: contentHTML,
            contentMarkDown: contentMarkDown,
            description: description,
            doctorId: doctorId,
        })
        let resDoctorInfo = await updateDoctorInfo({
            doctorId: doctorId,
            priceId: selectedPrice.value,
            provinceId: selectedProvince.value,
            paymentId: selectedPayment.value,
            nameClinic: clinicName,
            addressClinic: clinicAddress,
            note: note,
            specialtyId: selectedSpecialty.value,
        })
        if (resMarkDown && resMarkDown.errCode === 0 && resDoctorInfo && resDoctorInfo.errCode === 0) {
            toast.success('Update doctor successfully');
        } else {
            toast.error('Something wrong');
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html,
        })
    }

    handleChangeDescription = (e) => {
        this.setState({
            description: e.target.value,
        })
    }

    getDoctorInfo = async () => {
        let doctorId = this.props.userInfo.id;
        const res = await getDetailDoctorById(doctorId);
        if (res && res.errCode === 0) {
            let { description, contentHTML, contentMarkDown } = res.doctorInfo.Markdown;
            let { paymentData, provinceData, priceData, priceId, paymentId, provinceId, nameClinic, addressClinic, note, specialtyData } = res.doctorInfo.Doctor_Info;
            let { language } = this.props;
            let selectedPrice = {
                label: language === LANGUAGES.VI ? new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(priceData.valueVi) : new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(priceData.valueEn),
                value: priceId
            }
            let selectedProvince = {
                label: language === LANGUAGES.VI ? provinceData.valueVi : provinceData.valueEn,
                value: provinceId
            }
            let selectedPayment = {
                label: language === LANGUAGES.VI ? paymentData.valueVi : paymentData.valueEn,
                value: paymentId
            }
            let selectedSpecialty = {
                label: specialtyData.name,
                value: specialtyData.id,
            }
            this.setState({
                action: CRUD_ACTION.UPDATE,
                contentHTML: contentHTML,
                contentMarkDown: contentMarkDown,
                description: description,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedPayment: selectedPayment,
                selectedSpecialty: selectedSpecialty,
                note: note,
                clinicName: nameClinic,
                clinicAddress: addressClinic
            })
        }
    }

    handleChangeSelect = (type, selectedField) => {
        this.setState({
            [type]: selectedField
        })
    }

    handleChangeInput = (type, e) => {
        this.setState({
            [type]: e.target.value
        })
    }

    render () {
        const { selectedPrice, selectedProvince, selectedPayment, selectedSpecialty, clinicAddress, clinicName,
            note, allPrice, allProvince, allPayment, allSpecialty, action, contentMarkDown, description } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="text-center title" ><FormattedMessage id="menu.doctor.my-information" /></div>
                <div className="manage-doctor-input row">



                    <div className="doctor-description col-6">
                        <label><FormattedMessage id="manage-doctor.introduction" /></label>
                        <textarea className="form-control "
                            onChange={ (e) => this.handleChangeDescription(e) }
                            value={ description }></textarea>
                    </div>

                    <div className="payment-select col-4">
                        <label><FormattedMessage id="manage-doctor.specialty" /></label>
                        <Select
                            value={ selectedSpecialty }
                            onChange={ (selectedSpecialty) => this.handleChangeSelect('selectedSpecialty', selectedSpecialty) }
                            options={ allSpecialty }
                        />
                    </div>

                    <div className="price-select col-4">
                        <label><FormattedMessage id="manage-doctor.price" /></label>
                        <Select
                            value={ selectedPrice }
                            onChange={ (selectedPrice) => this.handleChangeSelect('selectedPrice', selectedPrice) }
                            options={ allPrice }
                        />
                    </div>

                    <div className="payment-select col-4">
                        <label><FormattedMessage id="manage-doctor.payment-method" /></label>
                        <Select
                            value={ selectedPayment }
                            onChange={ (selectedPayment) => this.handleChangeSelect('selectedPayment', selectedPayment) }
                            options={ allPayment }
                        />
                    </div>

                    <div className="province-select col-4">
                        <label><FormattedMessage id="manage-doctor.province" /></label>
                        <Select
                            value={ selectedProvince }
                            onChange={ (selectedProvince) => this.handleChangeSelect('selectedProvince', selectedProvince) }
                            options={ allProvince }
                        />
                    </div>

                    <div className="clinic-name-select col-4">
                        <label><FormattedMessage id="manage-doctor.clinic-name" /></label>
                        <input type="text" value={ clinicName } className="form-control" onChange={ (e) => this.handleChangeInput('clinicName', e) } />
                    </div>

                    <div className="clinic-address-select col-4">
                        <label><FormattedMessage id="manage-doctor.clinic-address" /></label>
                        <input type="text" value={ clinicAddress } className="form-control" onChange={ (e) => this.handleChangeInput('clinicAddress', e) } />
                    </div>

                    <div className="note-select col-4">
                        <label><FormattedMessage id="manage-doctor.note" /></label>
                        <input type="text" value={ note } className="form-control" onChange={ (e) => this.handleChangeInput('note', e) } />
                    </div>

                </div>
                <label><FormattedMessage id="manage-doctor.description" /></label>
                <MdEditor style={ { height: '500px' } }
                    renderHTML={ text => mdParser.render(text) }
                    onChange={ this.handleEditorChange }
                    value={ contentMarkDown ? contentMarkDown : '' }
                />
                { action === CRUD_ACTION.CREATE ?
                    <button class="submit-btn btn btn-primary" onClick={ () => this.handleSaveContentMarkDown() }>
                        <FormattedMessage id="manage-doctor.save" />
                    </button>
                    :
                    <button class="submit-btn btn btn-primary" onClick={ () => this.handleUpdateContentMarkDown() }>
                        <FormattedMessage id="manage-doctor.update" />
                    </button>
                }
            </div >
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allPrice: state.admin.allPrice,
        allProvince: state.admin.allProvince,
        allPayment: state.admin.allPayment,
        allSpecialty: state.admin.allSpecialty,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorInfoCode: () => dispatch(actions.fetchAllDoctorInfoCode()),
        fetchAllSpecialty: () => dispatch(actions.fetchAllSpecialty())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
