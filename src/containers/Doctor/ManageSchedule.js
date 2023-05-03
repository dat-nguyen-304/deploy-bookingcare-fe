import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTION, LANGUAGES } from '../../utils/constant';
import * as actions from '../../store/actions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { createBulkSchedule, getSchedule, updateBulkSchedule } from '../../services/adminService';
import ScheduleTable from '../System/ScheduleTable';
class MySchedule extends Component {
    state = {
        doctorId: 0,
        options: [],
        date: '',
        allTimeTypes: [],
        action: CRUD_ACTION.CREATE,
    }

    componentDidMount () {
        this.props.getAllTimeTypeStart();
        this.setState({
            doctorId: this.props.userInfo.id
        })
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (prevProps.allTimeTypes !== this.props.allTimeTypes) {
            let { allTimeTypes } = this.props;
            allTimeTypes = allTimeTypes.map((timType) => {
                return {
                    ...timType,
                    isSelected: false,
                }
            })
            this.setState({
                allTimeTypes
            })
        }
    }

    handleChangeDate = (date) => {
        this.getScheduleStatus(this.state.doctorId, date);
        this.setState({
            date
        })
    }

    getScheduleStatus = async (doctorId, date) => {
        let response = await getSchedule(date.getTime(), doctorId);
        if (response && response.errCode === 0) {
            let schedules = response.allSchedules;
            if (schedules && schedules.length > 0) {
                this.setState({
                    action: CRUD_ACTION.UPDATE
                })
            } else {
                this.setState({
                    action: CRUD_ACTION.CREATE
                })
            }
            let status = {};
            schedules.forEach((schedule) => {
                let key = schedule.timeType;
                status = {
                    ...status,
                    [key]: true
                }
            })
            schedules = this.state.allTimeTypes.map((schedule) => {
                if (status[schedule.keyMap])
                    return {
                        ...schedule,
                        isSelected: true,
                    }
                return {
                    ...schedule,
                    isSelected: false,
                }
            })
            this.setState({
                allTimeTypes: schedules
            })
        }
    }

    handClickRangeTime = (index) => {
        let copyState = this.state;
        copyState.allTimeTypes[index].isSelected = !copyState.allTimeTypes[index].isSelected;
        this.setState({
            ...copyState
        })
    }

    handleSubmit = async () => {
        let { doctorId, date, allTimeTypes } = this.state;
        allTimeTypes = allTimeTypes.filter(timType => {
            return timType.isSelected === true;
        })
        if (allTimeTypes.length === 0 || !doctorId || !date) {
            toast.error('Invalid input parameter');
            return;
        }
        allTimeTypes = allTimeTypes.map(timType => {
            return {
                timeType: timType.keyMap,
                date: date.getTime(),
                doctorId
            }
        })
        let res = await createBulkSchedule({ schedules: allTimeTypes });
        if (res && res.errCode === 0) {
            toast.success('Add successfully');
            this.setState({
                action: CRUD_ACTION.UPDATE,
            })
        }
    }

    handleUpdate = async () => {
        let { doctorId, date, allTimeTypes } = this.state;
        allTimeTypes = allTimeTypes.filter(timType => {
            return timType.isSelected === true;
        })
        if (allTimeTypes.length === 0 || !date) {
            toast.error('Invalid input parameter');
            return;
        }
        allTimeTypes = allTimeTypes.map(timType => {
            return {
                timeType: timType.keyMap,
                date: date.getTime(),
                doctorId
            }
        })
        let res = await updateBulkSchedule({ schedules: allTimeTypes });
        if (res && res.errCode === 0)
            toast.success('Update successfully');
    }

    render () {
        const { language } = this.props;
        const { allTimeTypes, date, action, doctorId } = this.state;
        return (
            <>
                <div className="text-center title"><FormattedMessage id="menu.doctor.my-schedule" /></div>
                <div className="manage-schedule-container">
                    <div className="row">
                        <div className="col-6">
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker className="form-control"
                                selected={ date }
                                onChange={ (date) => this.handleChangeDate(date) }
                                minDate={ new Date() }
                            />
                        </div>

                        { date &&
                            <>
                                <div className="col-12 range-time-container">
                                    {
                                        allTimeTypes && allTimeTypes.length > 0 &&
                                        allTimeTypes.map((timType, index) => {
                                            return (
                                                <div
                                                    className={ timType.isSelected === false ? "range-time" : "range-time active" }
                                                    onClick={ () => this.handClickRangeTime(index) }
                                                >
                                                    { language === LANGUAGES.VI ? timType.valueVi : timType.valueEn }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="col-12">
                                    {
                                        action === CRUD_ACTION.CREATE ?
                                            <button
                                                className="btn btn-primary submit-btn"
                                                onClick={ () => this.handleSubmit() }
                                            >
                                                <label><FormattedMessage id="manage-schedule.add-plan" /></label>
                                            </button>
                                            :
                                            <button
                                                className="btn btn-primary submit-btn"
                                                onClick={ () => this.handleUpdate() }
                                            >
                                                <label><FormattedMessage id="manage-schedule.update-plan" /></label>
                                            </button>
                                    }
                                </div>
                                <div className="schedule-table-container">
                                    <ScheduleTable
                                        doctorId={ doctorId }
                                        date={ date.getTime() }
                                    />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allTimeTypes: state.admin.allTimeTypes,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllTimeTypeStart: () => dispatch(actions.fetchAllTimeTypeStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MySchedule);
