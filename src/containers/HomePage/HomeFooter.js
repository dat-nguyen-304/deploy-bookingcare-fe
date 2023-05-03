import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';

class HomeFooter extends Component {
    render () {

        return (
            <div className="home-footer">
                <div className="home-footer-left">
                    &#169; <FormattedMessage id="home-section.copyright" />
                </div>
                <div className="home-footer-right">
                    <a href="/#"><i className="facebook-link fab fa-facebook-square"></i></a>
                    <a href="/#"><i className="youtube-link fab fa-youtube"></i></a>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
