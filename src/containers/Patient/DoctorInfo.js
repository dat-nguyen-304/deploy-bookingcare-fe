import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils/constant';
import { getDoctorInfo } from '../../services/adminService';
import { NumericFormat } from 'react-number-format';
import './DoctorInfo.scss';
class DoctorInfo extends Component {
    state = {
        clinicName: '',
        clinicAddress: '',
        note: '',
        count: 0,
        price: null,
        province: null,
        payment: null,
        showDetail: false,
    }

    async componentDidMount () {
        let res = await getDoctorInfo(this.props.doctorId);
        if (res && res.errCode === 0) {
            this.setState({
                clinicName: res.doctorInfo.nameClinic,
                clinicAddress: res.doctorInfo.addressClinic,
                note: res.doctorInfo.note,
                count: res.doctorInfo.count,
                price: res.doctorInfo.priceData,
                province: res.doctorInfo.provinceData,
                payment: res.doctorInfo.paymentData,
            });
            this.props.getPriceFromChild(res.doctorInfo.priceData);
        }
    }


    render () {
        let { clinicAddress, clinicName, note, price, payment, showDetail } = this.state;
        let { language } = this.props;
        price = price && (language === LANGUAGES.VI ? price.valueVi : price.valueEn);
        let suffix = language === LANGUAGES.VI ? 'VNĐ' : '$';
        return (
            <div class="doctor-info">
                <div className="address-title">
                    <FormattedMessage id="detail-doctor.address" />
                </div>
                <div className="clinic">
                    { clinicName }
                </div>
                <div className="address-content">
                    { clinicAddress }
                </div>
                { !showDetail &&
                    <div className="price">
                        <span className="price-title"><FormattedMessage id="detail-doctor.price" /></span>
                        <span className="price-number">
                            <NumericFormat displayType="text" value={ price } thousandSeparator={ true } suffix={ suffix } />
                        </span>
                    </div>
                }
                { showDetail &&
                    <div className="price-detail-table">
                        <div className="price-number-line">
                            <span className="price-title"><FormattedMessage id="detail-doctor.price" /></span>
                            <span className="price-number">
                                <NumericFormat displayType="text" value={ price } thousandSeparator={ true } suffix={ suffix } />
                            </span>
                        </div>
                        <p className="price-note">{ note }</p>
                        <p className="payment-method"><FormattedMessage id="detail-doctor.payment" /> { payment && (language === LANGUAGES.VI ? payment.valueVi : payment.valueEn) }</p>
                    </div>
                }
                <div className="see-more" onClick={ () => this.setState({ showDetail: !showDetail }) }>
                    { showDetail ? <FormattedMessage id="detail-doctor.hide" /> : <FormattedMessage id="detail-doctor.show-detail" /> }
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorInfo);
