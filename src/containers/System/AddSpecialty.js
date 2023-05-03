import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import CommonUtils from '../../utils/CommonUtils';
import { createSpecialty } from '../../services/adminService';
import { toast } from 'react-toastify';
import './SpecialtyManage.scss';
const mdParser = new MarkdownIt(/* Markdown-it options */);


class AddSpecialty extends Component {
    state = {
        name: '',
        contentHTML: '',
        contentMarkDown: '',
        imgUrl: '',
        isOpen: false,
        avatar: null,
    }

    handleChangeInput = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    getImgUrl = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                imgUrl: objectUrl,
                avatar: base64
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html,
        })
    }

    handleSaveSpecialty = async () => {
        let { name, contentHTML, contentMarkDown, avatar } = this.state;
        if (!name || !contentHTML || !contentMarkDown || !avatar) {
            toast.error('Invalid input parameters');
            return;
        }
        let res = await createSpecialty({ name, avatar, contentHTML, contentMarkDown });
        if (res && res.errCode === 0) {
            toast.success('Add specialty successfully');
            this.setState({
                name: '',
                contentHTML: '',
                contentMarkDown: '',
                imgUrl: '',
                isOpen: false,
                avatar: null,
            })
        } else {
            toast.error('Something is wrong')
        }
    }

    render () {
        let { name, imgUrl, isOpen, contentMarkDown } = this.state;
        return (
            <div className="specialty-manager-container">
                <div className="text-center title" ><FormattedMessage id="menu.admin.add-specialty" /></div>
                <div className="row">
                    <div className="col-6">
                        <label>Tên chuyên khoa</label>
                        <input type="text" value={ name } className="form-control" onChange={ (e) => this.setState({ name: e.target.value }) } />
                    </div>
                    <div className="col-6">
                        <label><FormattedMessage id="manage-user.avatar" /></label>
                        <input type="file" id="upload-user-img" hidden onChange={ this.getImgUrl } />
                        <div className="upload-img-container">
                            <label htmlFor="upload-user-img" className="upload-img btn btn-dark">Tải anh lên</label>
                            {
                                imgUrl &&
                                <div className="upload-img-preview" style={ { backgroundImage: `url(${imgUrl})` } } onClick={ () => this.setState({ isOpen: true }) }>
                                    { isOpen && (
                                        <Lightbox
                                            mainSrc={ imgUrl }
                                            onCloseRequest={ () => this.setState({ isOpen: false }) }
                                        />
                                    ) }
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-12">
                        <label><FormattedMessage id="manage-doctor.description" /></label>
                        <MdEditor style={ { height: '500px' } }
                            renderHTML={ text => mdParser.render(text) }
                            onChange={ this.handleEditorChange }
                            value={ contentMarkDown }
                        />
                    </div>
                    <div className="col-12">
                        <button class="submit-btn btn btn-primary" onClick={ () => this.handleSaveSpecialty() }>
                            <FormattedMessage id="manage-doctor.save" />
                        </button>
                    </div>
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(AddSpecialty);
