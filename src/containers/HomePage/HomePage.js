import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import OutstandingDoctor from './Section/OutstandingDoctor';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeBanner from './HomeBanner';
import './HomePage.scss';

class HomePage extends Component {

    render () {
        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };
        return (
            <div>
                <HomeHeader />
                <HomeBanner />
                <Specialty settings={ settings } />
                <OutstandingDoctor settings={ settings } />
                <About />
                <HomeFooter />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
