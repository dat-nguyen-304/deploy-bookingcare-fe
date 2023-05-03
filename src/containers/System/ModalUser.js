import axios from 'axios';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
class ModalUser extends Component {

    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
    }

    componentDidMount () {
    }

    toggle = () => {
        this.props.toggleUserModal();
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
        let attributes = ['email', 'password', 'firstName', 'lastName', 'address'];
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

    createUser = async () => {
        let check = this.checkNullInput();
        if (check) {
            await this.props.handleCreateUser(this.state);
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        }
    }

    render () {
        console.log('render modal create user');

        return (
            <Modal
                isOpen={ this.props.isOpenModalUser }
                toggle={ () => this.toggle() }
                size="lg"
                centered
                className="modal-user-container"
            >
                <ModalHeader toggle={ () => this.toggle() }>Create an user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input type="text"
                                value={ this.state.email }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'email') } } />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input type="text"
                                value={ this.state.password }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'password') } } />
                        </div>
                        <div className="input-container">
                            <label>First Name</label>
                            <input type="text"
                                value={ this.state.firstName }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'firstName') } } />
                        </div>
                        <div className="input-container">
                            <label>Last Name</label>
                            <input type="text"
                                value={ this.state.lastName }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'lastName') } } />
                        </div>
                        <div className="input-container">
                            <label>Address</label>
                            <input type="text"
                                value={ this.state.address }
                                onChange={ (e) => { this.handleOnChangeInput(e, 'address') } } />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="px-2" onClick={ () => this.createUser() }>
                        Add User
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
