import React, { Component } from 'react';
import { connect } from "react-redux";
import Header from '../containers/Header/Header';
import { withRouter } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/Doctor/ManageSchedule';
import DoctorDetail from '../containers/Doctor/DoctorDetail';
import { ROLES } from '../utils/constant';
import errorPage from '../assets/404.jpg'
class System extends Component {
    render () {
        let { isLoggedIn, userInfo } = this.props;
        return (
            <div className="system-container">
                { isLoggedIn && userInfo.roleId === ROLES.DOCTOR ?
                    <>
                        <Header />
                        <div className="system-list" style={ { marginTop: '60px' } }>
                            <Switch>
                                <Route path="/doctor/manage-schedule" component={ ManageSchedule } />
                                <Route path="/doctor/info" component={ DoctorDetail } />
                                <Route component={ () => { return (<Redirect to='/doctor/manage-schedule' />) } } />
                            </Switch>
                        </div>
                    </>
                    :
                    <img src={ errorPage } alt="/#" />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(System));
