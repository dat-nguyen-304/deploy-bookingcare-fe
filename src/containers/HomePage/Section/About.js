import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
class About extends Component {
    render () {

        return (
            <div className="section section-about">
                <div className="section-content">
                    <div className="section-video">
                        <iframe width="853" height="480"
                            src="https://www.youtube.com/embed/8NBPLhyYlOw"
                            title="Hướng dẫn sử dụng Kit Test Covid nước bọt LYHER"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div className="section-about-description">
                        <FormattedMessage id="home-section.description" />
                    </div>
                </div>
            </div >
        );
    }
}

export default About;
