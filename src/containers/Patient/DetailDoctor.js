import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeFooter from '../HomePage/HomeFooter';
import { getDetailDoctorById } from '../../services/adminService';
import DoctorSchedule from './DoctorSchedule';
import DoctorInfo from './DoctorInfo';
import ModalBooking from './ModalBooking';
import IntroDoctor from './IntroDoctor';
import './DetailDoctor.scss';

class DetailDoctor extends Component {
    state = {
        firstName: '',
        lastName: '',
        fullName: '',
        image: '',
        positionData: '',
        priceData: '',
        contentHTML: '',
        description: '',
        openModal: false,
        time: null,
        date: null,
        dayTimeStamp: 0,
        isLoading: false,
    }

    async componentDidMount () {
        let doctorId = this.props.match.params.id;
        let res = await getDetailDoctorById(doctorId);
        if (res && res.errCode === 0) {
            this.setState({
                firstName: res.doctorInfo.firstName,
                lastName: res.doctorInfo.lastName,
                image: res.doctorInfo.image,
                positionData: res.doctorInfo.positionData,
                contentHTML: res.doctorInfo.Markdown.contentHTML,
                description: res.doctorInfo.Markdown.description,
            })
        }
    }

    passFullName = (fullName) => {
        this.setState({
            fullName
        })
    }

    getPriceFromChild = (priceData) => {
        this.setState({
            priceData: priceData,
        })
    }

    toggleModal = (timeString = null, dateString = null, dayTimeStamp) => {
        this.setState({
            openModal: !this.state.openModal,
            timeString,
            dateString,
            dayTimeStamp
        })
    }

    render () {
        let { priceData, image, description, contentHTML, openModal, positionData, firstName, lastName, fullName, timeString, dateString, dayTimeStamp } = this.state;
        return (
            <>

                <HomeHeader />
                <IntroDoctor
                    image={ image }
                    description={ description }
                    positionData={ positionData }
                    firstName={ firstName }
                    lastName={ lastName }
                    passFullName={ this.passFullName }
                />
                <div class="schedule-container">
                    <div className="schedule-content-left">
                        <DoctorSchedule
                            doctorId={ this.props.match.params.id }
                            toggleModal={ this.toggleModal }
                        />
                    </div>
                    <div className="schedule-content-right">
                        <DoctorInfo
                            doctorId={ this.props.match.params.id }
                            getPriceFromChild={ this.getPriceFromChild }
                        />
                    </div>
                </div>
                <div className="doctor-detail">
                    <div dangerouslySetInnerHTML={ { __html: `${contentHTML ? contentHTML : ''}` } }></div>
                </div>
                <div className="doctor-feedback">
                </div>
                <HomeFooter />
                <ModalBooking
                    doctorId={ this.props.match.params.id }
                    toggleModal={ this.toggleModal }
                    openModal={ openModal }
                    image={ image }
                    description={ description }
                    doctorFullName={ fullName }
                    price={ priceData }
                    timeString={ timeString }
                    dateString={ dateString }
                    dayTimeStamp={ dayTimeStamp }
                    positionData={ positionData }
                    firstName={ firstName }
                    lastName={ lastName }
                />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
