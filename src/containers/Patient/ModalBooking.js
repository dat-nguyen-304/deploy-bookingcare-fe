import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils/constant';
import { toast } from 'react-toastify';
import { Modal } from 'reactstrap';
import './ModalBooking.scss';
import { createBooking } from '../../services/patientService';
import IntroDoctor from '../../containers/Patient/IntroDoctor';
import { ThreeDots } from 'react-loader-spinner'

class ModalBooking extends Component {
    state = {
        patientFullName: '',
        phone: '',
        reason: '',
        isLoading: false,
    }

    handleChange = (e, key) => {
        this.setState({
            [key]: e.target.value,
        })
    }

    submitBooking = async () => {
        let { patientFullName, phone, reason } = this.state;
        let { language, doctorId, dayTimeStamp, user, timeString, doctorFullName } = this.props;
        if (!patientFullName || !phone || !reason) {
            toast.error('Invalid input parameter');
            return;
        }
        let selector = language === LANGUAGES.VI ? ".date-and-time .schedule-vi" : ".date-and-time .schedule-en";
        let dateAndTime = document.querySelector(selector).innerHTML;
        this.setState({
            isLoading: true,
        })
        let res = await createBooking({
            doctorId,
            patientFullName,
            phone,
            reason,
            date: dayTimeStamp,
            patientId: user.id,
            timeType: timeString.timeType,
            doctorFullName,
            patientEmail: user.email,
            dateAndTime,
            language,
        });
        if (res && res.errCode === 0) {
            this.setState({
                isLoading: false,
            })
            toast.success('Book successfully')
        }
        if (res && res.errCode !== 0) {
            this.setState({
                isLoading: false,
            })
            toast.error(res.errMessage);
        }
    }

    render () {
        let { language, toggleModal, openModal, doctorFullName, description, image, price, dateString, timeString, positionData, firstName, lastName } = this.props;
        let { patientFullName, phone, reason, isLoading } = this.state;
        price = price && (language === LANGUAGES.VI ? price.valueVi : price.valueEn);
        return (
            <>
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
                            <FormattedMessage id="detail-doctor.modal.title" />
                        </div>
                        <div className="modal-header-close" onClick={ () => toggleModal() }>
                            <i class="far fa-times-circle"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <IntroDoctor
                            doctorFullName={ doctorFullName }
                            image={ image }
                            description={ description }
                            positionData={ positionData }
                            firstName={ firstName }
                            lastName={ lastName }
                            price={ price }
                            timeString={ timeString }
                            dateString={ dateString }
                        />

                        <div className="row">
                            <div className="col-12">
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="detail-doctor.modal.full-name" /></label>
                                <input type="text" className="form-control"
                                    value={ patientFullName }
                                    onChange={ (e) => this.handleChange(e, 'patientFullName') }
                                />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="detail-doctor.modal.phone" /></label>
                                <input type="text" className="form-control"
                                    value={ phone }
                                    onChange={ (e) => this.handleChange(e, 'phone') }
                                />
                            </div>
                            <div className="col-12">
                                <label><FormattedMessage id="detail-doctor.modal.reason" /></label>
                                <input type="text" className="form-control"
                                    value={ reason }
                                    onChange={ (e) => this.handleChange(e, 'reason') }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="button-confirm" onClick={ () => this.submitBooking() }><FormattedMessage id="detail-doctor.modal.confirm" /></div>
                        <div className="button-cancel" onClick={ () => toggleModal() }><FormattedMessage id="detail-doctor.modal.cancel" /></div>
                    </div>
                </Modal >
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBooking);
