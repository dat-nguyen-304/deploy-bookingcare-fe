import React, { Component } from 'react';
import { connect } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LANGUAGES } from '../../utils/constant';
import { NumericFormat } from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import './IntroDoctor.scss';
class IntroDoctor extends Component {
    state = {
        fullName: '',
    }
    componentDidMount () {
        this.getFullName();
    }
    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language || prevProps.firstName !== this.props.firstName) {
            this.getFullName();
        }
    }

    getFullName = () => {
        let { language, positionData, firstName, lastName, passFullName } = this.props;
        if (firstName && lastName && positionData) {
            let fullName =
                positionData && language === LANGUAGES.VI ?
                    `${positionData.valueVi}, ${lastName} ${firstName} `
                    :
                    `${positionData.valueEn}, ${firstName} ${lastName}  `;
            if (fullName) {
                this.setState({
                    fullName: fullName
                })
                if (passFullName)
                    passFullName(fullName);
            }
        }
    }

    render () {
        console.log(this.props);
        let { image, description, price, language, linkToDoctorDetail, timeString, dateString } = this.props;
        let { fullName } = this.state;
        let suffix = language === LANGUAGES.VI ? 'VNĐ' : '$';
        return (
            <>
                <div className="doctor-intro" onClick={ linkToDoctorDetail }>
                    <div className="doctor-avatar"
                        style={ { backgroundImage: `url(${image})` } }
                    />
                    <div className="doctor-intro-text">
                        <div className="doctor-name">
                            { fullName }
                        </div>
                        <div className="doctor-description">
                            { description }
                        </div>
                        <p className="date-and-time">
                            { timeString && (
                                language === LANGUAGES.VI ?
                                    <div className="schedule-vi">
                                        <FormattedMessage id="detail-doctor.modal.date" /> { dateString } < FormattedMessage id="detail-doctor.modal.time" />  { timeString.timeData.valueVi }
                                    </div>
                                    :
                                    <div className="schedule-en">
                                        <FormattedMessage id="detail-doctor.modal.date" /> { dateString } < FormattedMessage id="detail-doctor.modal.time" />  { timeString.timeData.valueEn }
                                    </div>
                            ) }
                        </p>
                        { price &&
                            <p className="price">
                                <FormattedMessage id="detail-doctor.modal.price" /><NumericFormat displayType="text" value={ price } thousandSeparator={ true } suffix={ suffix } />
                            </p>
                        }
                    </div>
                </div>
            </>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(IntroDoctor);
