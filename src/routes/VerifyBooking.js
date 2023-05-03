import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../containers/HomePage/HomeHeader';
import { verifyBooking } from '../services/adminService';
import { FormattedMessage } from 'react-intl';


class Doctor extends Component {
    state = {
        errCode: null,
        loading: true,
    }
    componentDidMount = async () => {
        const urlParams = new URLSearchParams(this.props.location.search);
        const token = urlParams.get('token');
        const doctorId = urlParams.get('doctorId');

        const res = await verifyBooking(doctorId, token);
        if (res) {
            this.setState({
                loading: false,
                errCode: res.errCode
            })
        }

    }

    getKey = () => {
        const { loading, errCode } = this.state;
        if (loading) return "verify-booking.loading";
        else {
            if (errCode === -1) return "verify-booking.server-error";
            else if (errCode === 0) return "verify-booking.success";
            else if (errCode === 1) return "verify-booking.not-found";
            else if (errCode === 2) return "verify-booking.expired";
        }
        return "verify-booking.nothing";
    }

    render () {
        return (
            <div className="">
                <HomeHeader />
                <div className="title" style={ { marginTop: '100px', color: 'red' } }>
                    <FormattedMessage id={ this.getKey() } />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
