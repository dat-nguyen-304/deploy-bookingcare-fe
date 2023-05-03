import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils/constant';
import { toast } from 'react-toastify';
import { getBooking, changeBookingStatus } from '../../services/adminService';
import ModalSendInvoice from './ModalSendInvoice';
import { getAllUsers } from '../../services/adminService'
import './ScheduleTable.scss';
class AdminManage extends Component {
    state = {
        bookings: [],
        openModal: false,
        modalData: {}
    }

    async componentDidMount () {
        const { doctorId, date } = this.props;
        let response = await getBooking(doctorId, date);
        if (response && response.errCode === 0) {
            let bookings = response.bookings;
            this.setState({ bookings });
        }
    }

    async componentDidUpdate (prevProps, prevState, snapshot) {
        const { doctorId, date } = this.props;
        if (prevProps.doctorId !== doctorId || prevProps.date !== date) {
            let response = await getBooking(doctorId, date);
            if (response && response.errCode === 0) {
                let bookings = response.bookings;
                this.setState({ bookings });
            }
        }
    }

    changeStatus = async (doctorId, date, toStatus, index) => {
        let { bookings } = this.state;
        if (doctorId && date && toStatus) {
            date = new Date(date).getTime();
            let response = await changeBookingStatus(doctorId, date, toStatus);
            if (response && response.errCode === 0) {
                bookings[index] = response.booking;
                this.setState({ bookings })
                toast.success('Update success');
            } else {
                toast.error('Update failed');
            }
        }
    }

    openModalSendInvoice = async (doctorId, patientId, patientFullName, date, index) => {
        const response = await getAllUsers(patientId);
        let userEmail = '';
        if (response && response.errCode === 0) {
            userEmail = response.users.email;
        }
        this.setState({
            modalData: {
                doctorId, patientFullName, date, index, userEmail
            }
        })
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState({
            openModal: !this.state.openModal,
        })
    }

    getStatusAndAction = (booking, index) => {
        let { language } = this.props;
        let status = booking.statusId;
        if (status === 'S1') {
            return (
                <>
                    <td className='text-black'>
                        { language === LANGUAGES.VI ? booking.statusData.valueVi : booking.statusData.valueEn }</td>
                    <td>
                    </td>
                </>
            )
        }
        else if (status === 'S2') {
            return (
                <>
                    <td className='text-primary'>
                        { language === LANGUAGES.VI ? booking.statusData.valueVi : booking.statusData.valueEn }</td>
                    <td>
                        <button
                            className="btn-success px-2 rounded-lg mr-2"
                            onClick={ () => this.openModalSendInvoice(booking.doctorId, booking.patientId, booking.patientFullName, booking.date, index) } >
                            <FormattedMessage id="manage-schedule.done" />
                        </button>
                        <button
                            className="btn-danger px-2 rounded-lg"
                            onClick={ () => this.changeStatus(booking.doctorId, booking.date, 'S4', index) }>
                            <FormattedMessage id="manage-schedule.cancel" />
                        </button>
                    </td>
                </>
            )
        } else if (status === 'S3') {
            return (
                <>
                    <td className='text-success'>
                        { language === LANGUAGES.VI ? booking.statusData.valueVi : booking.statusData.valueEn }</td>
                    <td>
                    </td>
                </>
            )
        } else if (status === 'S4') {
            return (
                <>
                    <td className='text-danger'>
                        { language === LANGUAGES.VI ? booking.statusData.valueVi : booking.statusData.valueEn }</td>
                    <td>
                    </td>
                </>
            )
        }
    }

    render () {
        const { language } = this.props;
        const { bookings, openModal, modalData } = this.state;
        return (
            <>
                { (bookings && bookings.length > 0) ?
                    <table id="bookings">
                        <tbody>
                            <tr>
                                <th style={ { width: '100px' } }><FormattedMessage id="manage-schedule.index" /></th>
                                <th style={ { width: '200px' } }><FormattedMessage id="manage-schedule.patient-full-name" /></th>
                                <th style={ { width: '120px' } }><FormattedMessage id="manage-schedule.phone" /></th>
                                <th style={ { width: '150px' } }><FormattedMessage id="manage-schedule.time" /></th>
                                <th><FormattedMessage id="manage-schedule.reason" /></th>
                                <th style={ { width: '150px' } }><FormattedMessage id="manage-schedule.status" /></th>
                                <th style={ { width: '200px' } }><FormattedMessage id="manage-schedule.action" /></th>
                            </tr>
                            {
                                bookings && bookings.length > 0 &&
                                bookings.map((booking, index) => (
                                    <tr key={ booking.id }>
                                        <td>{ index + 1 }</td>
                                        <td>{ booking.patientFullName }</td>
                                        <td>{ booking.phone }</td>
                                        <td>{ language === LANGUAGES.VI ? booking.timeData.valueVi : booking.timeData.valueEn }</td>
                                        <td>{ booking.reason }</td>
                                        { this.getStatusAndAction(booking, index) }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    :
                    <p className="mt-4 title"><FormattedMessage id="manage-schedule.no-patient" /></p>
                }
                <ModalSendInvoice
                    toggleModal={ this.toggleModal }
                    openModal={ openModal }
                    modalData={ modalData }
                    changeStatus={ this.changeStatus }
                />
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminManage);
