import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import { withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions';

class Specialty extends Component {
    state = {
        allSpecialty: [],
    }

    componentDidMount () {
        this.props.fetchAllSpecialty();
    }

    getDetailSpecialty = (id) => {
        this.props.history.push(`detail-specialty/${id}`)
    }

    render () {
        let { allSpecialty } = this.props;
        console.log('all specialty: ', allSpecialty)
        return (
            <div className="section section-specialty">
                <div className="section-content">
                    <div className="section-header">
                        <div className="section-title"><FormattedMessage id="home-section.popular-specialty" /></div>
                        <a href="/#" className="section-button"><FormattedMessage id="home-section.see-more" /></a>
                    </div>
                    <Slider { ...this.props.settings }>
                        {
                            allSpecialty && allSpecialty.length > 0 &&
                            allSpecialty.map((specialty) => {
                                return (
                                    <div className="specialty-item-container">
                                        <div className="specialty-item" onClick={ () => this.getDetailSpecialty(specialty.id) }>
                                            <div className="section-img" style={ { backgroundImage: `url(${specialty.image})` } } />
                                            <p>{ specialty.name }</p>
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
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(actions.fetchAllSpecialty())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
