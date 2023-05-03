import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import './SpecialtyInfo.scss';
import { getSpecialtyById } from '../../services/adminService'

class SpecialtyInfo extends Component {
    state = {
        showMore: false,
        image: '',
        contentHTML: '',
    }
    async componentDidMount () {
        let { specialtyId } = this.props;
        let response = await getSpecialtyById(specialtyId);
        if (response && response.errCode === 0) {
            let specialty = response.specialty;
            this.setState({
                name: specialty.name,
                image: specialty.image,
                contentHTML: specialty.contentHTML,
            })
        }
    }

    toggleShowMore = () => {
        this.setState({
            showMore: !this.state.showMore
        })
    }

    render () {
        const { showMore, image, contentHTML } = this.state;
        return (
            <>
                <div className="specialty-info" >
                    <input type="checkbox" id="show-hide" />
                    <div className="specialty-content">
                        <div dangerouslySetInnerHTML={ { __html: `${contentHTML ? contentHTML : ''}` } }>

                        </div>
                    </div>
                    <div className="show-hide-button">
                        <label onClick={ this.toggleShowMore } for="show-hide">
                            { showMore ?
                                <FormattedMessage id="detail-specialty.show-less" />
                                :
                                <FormattedMessage id="detail-specialty.show-more" />
                            }
                        </label>
                    </div>
                    <div className="specialty-image" style={ { backgroundImage: `url(${image})` } }></div>
                </div>
            </>

        );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpecialtyInfo));
