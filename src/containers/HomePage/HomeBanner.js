import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import hospital from '../../assets/hospital.png';
import phone from '../../assets/phone.png';
import overal from '../../assets/overal.png';
import microscope from '../../assets/microscope.png';
import mental from '../../assets/mental.png';
import dental from '../../assets/dental.png';
import { injectIntl } from 'react-intl';
import './HomeBanner.scss';

class HomeBanner extends Component {
    render () {
        const placeholder = this.props.intl.formatMessage({ id: 'banner.search-doctor' });
        return (
            <div className="home-header-banner">
                <div className="content-up">
                    <div className="title1"><FormattedMessage id="banner.medical-background" /></div>
                    <div className="title2"><FormattedMessage id="banner.comprehensive-health" /></div>
                    <div className="search">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder={ placeholder } />
                    </div>
                </div>
                <div className="content-down">
                    <div className="options">
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${hospital})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.specialized-exam" />
                            </div>
                        </div>
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${phone})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.remote-exam" />
                            </div>
                        </div>
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${overal})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.general-exam" />
                            </div>
                        </div>
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${microscope})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.medical-test" />
                            </div>
                        </div>
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${mental})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.mental-health" />
                            </div>
                        </div>
                        <div className="option-item">
                            <div className="option-img-bg">
                                <div className="option-img" style={ { backgroundImage: `url(${dental})` } }>
                                </div>
                            </div>
                            <div className="option-title">
                                <FormattedMessage id="banner.dental-exam" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HomeBanner));
