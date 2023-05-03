import React, { Component } from 'react';
import { connect } from "react-redux";
import Header from '../containers/Header/Header';
import { withRouter } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserRedux from '../containers/System/UserRedux';
import DoctorManage from '../containers/System/DoctorManage';
import AddSpecialty from '../containers/System/AddSpecialty';
import UpdateSpecialty from '../containers/System/UpdateSpecialty';
import ScheduleManage from '../containers/System/ScheduleManage';
import { ROLES } from '../utils/constant';
import errorPage from '../assets/404.jpg'
class System extends Component {
    render () {
        let { systemMenuPath, isLoggedIn, userInfo } = this.props;
        return (
            <div className="system-container">
                { isLoggedIn && userInfo.roleId === ROLES.ADMIN ?
                    <>
                        <Header />
                        <div className="system-list" style={ { marginTop: '60px' } }>
                            <Switch>
                                <Route path="/system/manage-user" component={ UserRedux } />
                                <Route path="/system/manage-doctor" component={ DoctorManage } />
                                <Route path="/system/manage-schedule" component={ ScheduleManage } />
                                <Route path="/system/add-specialty" component={ AddSpecialty } />
                                <Route path="/system/update-specialty" component={ UpdateSpecialty } />
                                <Route component={ () => { return (<Redirect to={ systemMenuPath } />) } } />
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
