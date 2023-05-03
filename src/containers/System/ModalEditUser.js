import axios from 'axios';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
class ModalEditUser extends Component {

    constructor (props) {
        super(props);
        this.state = {
            id: this.props.editUser.id,
            firstName: this.props.editUser.firstName,
            lastName: this.props.editUser.lastName,
            address: this.props.editUser.address
        }
    }

    shouldComponentUpdate () {

        return true;
    }

    componentDidMount () {
    }

    toggle = () => {
        this.props.toggleEditUserModal();
    }

    handleOnChangeInput = (e, attribute) => {
        const copyState = this.state;
        copyState[attribute] = e.target.value;
        this.setState({
            ...copyState
        })
    }

    checkNullInput = () => {
        let isValid = true;
        let attributes = ['firstName', 'lastName', 'address'];
        for (let i = 0; i < attributes.length; i++) {
            let attr = attributes[i];
            if (!this.state[attr]) {
                alert(attr + ' must not be empty');
                isValid = false;
                break;
            }
        };
        return isValid;
    }

    saveUser = async () => {
        let check = this.checkNullInput();
        if (check) {
            await this.props.handleEditUser(this.state);
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
            this.toggle();
        }
    }

    render () {
        console.log('render modal edit user');
        return (
            <Modal
                isOpen={ this.props.isOpenEditModalUser }
                size="lg"
                centered
                className="modal-user-container"
            >
                <ModalHeader toggle={ () => this.toggle() }>Edit an user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input type="text"
                                value={ this.props.editUser.email }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'email') } }
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input type="text"
                                value='123456'
                                onChange={ (e) => { this.handleOnChangeInput(e, 'password') } }
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label>First Name</label>
                            <input type="text"
                                value={ this.state.firstName }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'firstName') } }
                            />
                        </div>
                        <div className="input-container">
                            <label>Last Name</label>
                            <input type="text"
                                value={ this.state.lastName }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'lastName') } }
                            />
                        </div>
                        <div className="input-container">
                            <label>Address</label>
                            <input type="text"
                                value={ this.state.address }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'address') } }
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="px-2" onClick={ () => this.saveUser() }>
                        Save changes
                    </Button>{ ' ' }
                    <Button color="secondary" className="px-2" onClick={ () => this.toggle() }>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
