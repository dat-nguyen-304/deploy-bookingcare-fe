import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select'

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import * as actions from '../../store/actions';
import CommonUtils from '../../utils/CommonUtils';
import { updateSpecialty } from '../../services/adminService';
import { toast } from 'react-toastify';
import './SpecialtyManage.scss';
const mdParser = new MarkdownIt(/* Markdown-it options */);


class UpdateSpecialty extends Component {
    state = {
        name: '',
        contentHTML: '',
        contentMarkDown: '',
        imgUrl: '',
        isOpen: false,
        avatar: null,
        specialtyOption: [],
        selectedSpecialty: null,
        allSpecialty: null
    }
    componentDidMount () {
        this.props.fetchAllSpecialty();
        if (!this.state.allSpecialty)
            this.setState({
                allSpecialty: this.props.allSpecialty
            })
        this.getSpecialtyOptions();
    }

    handleChangeInput = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    getSpecialtyOptions () {
        let allSpecialty = [];
        if (this.state.allSpecialty) {
            allSpecialty = this.state.allSpecialty;
        }
        else allSpecialty = this.props.allSpecialty;
        let specialtyOption = [];
        if (allSpecialty) {
            specialtyOption = allSpecialty.map(specialty => {
                return {
                    value: specialty.id,
                    label: specialty.name
                }
            })
            this.setState({
                specialtyOption,
            })
        }
    }

    handleChangeSpecialty = (selectedSpecialty) => {
        let specialtyId = selectedSpecialty.value;
        let currentSpecialty = this.state.allSpecialty.find(specialty => { return specialty.id === specialtyId });
        this.setState({
            selectedSpecialty,
            name: currentSpecialty.name,
            contentHTML: currentSpecialty.contentHTML,
            contentMarkDown: currentSpecialty.contentMarkDown,
            imgUrl: currentSpecialty.image,
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkDown: text,
            contentHTML: html,
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

    handleUpdateSpecialty = async () => {
        let { name, contentHTML, contentMarkDown, imgUrl, selectedSpecialty, allSpecialty } = this.state;
        let id = selectedSpecialty.value;
        let avatar = null;
        if (imgUrl) {
            avatar = Buffer.from(imgUrl, 'base64').toString('binary');
        }
        if (!name || !contentHTML || !contentMarkDown || !avatar) {
            toast.error('Invalid input parameters');
            return;
        }
        let res = await updateSpecialty({ id, name, avatar, contentHTML, contentMarkDown });
        if (res && res.errCode === 0) {
            toast.success('Update specialty successfully');
            for (let i = 0; i < allSpecialty.length; i++) {
                let specialty = allSpecialty[i];
                if (specialty.id === id) {
                    allSpecialty[i].name = name;
                    allSpecialty[i].contentHTML = contentHTML;
                    allSpecialty[i].contentMarkDown = contentMarkDown;
                    allSpecialty[i].image = imgUrl;
                    break;
                }
            }
            this.setState({
                allSpecialty,
                selectedSpecialty: {
                    value: id,
                    label: name
                }
            })
            this.getSpecialtyOptions();
        } else {
            toast.error('Something is wrong')
        }
    }

    render () {
        let { name, imgUrl, isOpen, contentMarkDown, specialtyOption, selectedSpecialty } = this.state;
        return (
            <div className="specialty-manager-container">
                <div className="text-center title" ><FormattedMessage id="menu.admin.update-specialty" /></div>
                <div className="row">
                    <div className="col-12">
                        <label>Chọn chuyên khoa</label>
                        <Select
                            value={ selectedSpecialty }
                            onChange={ this.handleChangeSpecialty }
                            options={ specialtyOption }
                        />
                    </div>
                    { selectedSpecialty &&
                        <>
                            <div className="col-6">
                                <label>Tên chuyên khoa</label>
                                <input type="text"
                                    value={ name }
                                    className="form-control"
                                    onChange={ (e) => this.setState({ name: e.target.value }) }
                                />
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
                                <button class="submit-btn btn btn-primary" onClick={ () => this.handleUpdateSpecialty() }>
                                    <FormattedMessage id="manage-doctor.update" />
                                </button>
                            </div>
                        </>
                    }
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSpecialty);
