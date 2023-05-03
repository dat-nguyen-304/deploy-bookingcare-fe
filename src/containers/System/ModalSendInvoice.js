import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { ThreeDots } from 'react-loader-spinner'
import CommonUtils from '../../utils/CommonUtils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './ModalSendInvoice.scss';
import { sendInvoiceToEmail } from '../../services/adminService';
class ModalSendInvoice extends Component {
    state = {
        patientFullName: '',
        phone: '',
        reason: '',
        isLoading: false,
        imgUrl: '',
        isOpen: false,
        invoiceImg: ''
    }

    openLightbox = () => {
        if (this.state.imgUrl) {
            this.setState({
                isOpen: true,
            })
        }
    }

    getImgUrl = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                imgUrl: objectUrl,
                invoiceImg: base64
            })
        }
    }

    sendInvoice = async () => {
        let { changeStatus, toggleModal, language } = this.props;
        let { doctorId, patientFullName, index, date, userEmail } = this.props.modalData;
        let { invoiceImg } = this.state;
        this.setState({
            isLoading: true
        })
        await sendInvoiceToEmail(userEmail, patientFullName, invoiceImg, language);
        changeStatus(doctorId, date, 'S3', index);
        toggleModal();
        this.setState({
            isLoading: false
        })
    }

    render () {
        let { openModal, toggleModal } = this.props;
        let { isLoading, imgUrl, isOpen } = this.state;
        return (
            <div className="modal-send-invoice">
                <ThreeDots
                    height="100"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="three-dots-loading"
                    wrapperClass="modal-booking-loading"
                    visible={ isLoading }
                />
                <Modal isOpen={ openModal }
                    size="lg"
                    centered
                >
                    <div className="modal-header-container">
                        <div className="modal-header-title">
                            <FormattedMessage id="manage-schedule.send-invoice" />
                        </div>
                        <div className="modal-header-close" onClick={ () => toggleModal() }>
                            <i class="far fa-times-circle"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <input type="file" id="upload-user-img" hidden onChange={ this.getImgUrl } />
                        <div className="upload-img-container">
                            <label htmlFor="upload-user-img" className="upload-img btn btn-dark px-2">
                                <FormattedMessage id="manage-schedule.upload-invoice" />
                            </label>
                            {
                                imgUrl &&
                                <div className="upload-img-preview modal-send-invoice" style={ { backgroundImage: `url(${imgUrl})` } } onClick={ this.openLightbox }>
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
                    <div className="modal-footer">
                        <div className="button-confirm" onClick={ () => this.sendInvoice() }><FormattedMessage id="detail-doctor.modal.confirm" /></div>
                        <div className="button-cancel" onClick={ () => toggleModal() }><FormattedMessage id="detail-doctor.modal.cancel" /></div>
                    </div>
                </Modal >
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSendInvoice);
