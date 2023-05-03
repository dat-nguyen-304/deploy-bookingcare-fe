import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils/constant';
import { withRouter } from 'react-router-dom';

class OutstandingDoctor extends Component {
    componentDidMount () {
        this.props.loadTopDoctors();
    }

    getDetailDoctor = (id) => {
        this.props.history.push(`detail-doctor/${id}`)
    }

    render () {
        let { topDoctors, language } = this.props;
        return (
            <div className="section section-doctor">
                <div className="section-content"><div className="section-header">
                    <div className="section-title"><FormattedMessage id="home-section.outstanding-doctor" /></div>
                    <a href="/#" className="section-button"><FormattedMessage id="home-section.search" /></a>
                </div>

                    <Slider { ...this.props.settings }>
                        { topDoctors && topDoctors.length > 0 &&
                            topDoctors.map(doctor => {
                                let nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName} `;
                                let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName} `;
                                return (
                                    <div className="section-img-container" onClick={ () => this.getDetailDoctor(doctor.id) }>
                                        <div className="section-doctor-img" style={ { backgroundImage: `url(${doctor.image})` } }>
                                        </div>
                                        <div className="section-doctor-info">
                                            <p className="position-fullname">{ language === LANGUAGES.EN ? nameEn : nameVi }</p>
                                            <p className="position-specialty">{ doctor.Doctor_Info.specialtyData.name }</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        topDoctors: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
