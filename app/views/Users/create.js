import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from  'react-apollo'
import { client } from '../../redux/Store'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import updateForm from '../../redux/Actions/sync/updateForm'
import resetForm from '../../redux/Actions/sync/resetForm'


//graphql queries
const createUserQuery = gql`
    mutation createUser($firstName: String!, $lastName: String!) {
        createUser(firstName: $firstName, lastName:$lastName) {
            id, 
            firstName,
            lastName,
            createdAt,
            updatedAt
        }
    }
`;


export class CreateUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            formName: 'createUserForm',
            updating: this.props.initialState && !!this.props.initialState.id,
            createdUser: null
        };
        

        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(event, payloadProperty) {
        this.props.updateForm({ form: this.state.formName, key: payloadProperty, value: event.target.value })
    }

    onSubmit(e) {
        e.preventDefault();

        let _this = this;
        
        if (!this.props.payload.firstName.trim() || !this.props.payload.lastName.trim()) {
            return;
        }

        this.props.createUser({
            variables: {
                firstName: this.props.payload.firstName,
                lastName: this.props.payload.lastName
            },
            refetchQueries: [ 'allUsersQuery' ],
        }).then(({ data }) => {
            this.state.createdUser = data.createUser;
            this.props.resetForm(this.state.formName);
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    

        
    }
    render() {
        return (
            <div>
                <form name={this.state.formName} onSubmit={ (e) => { this.onSubmit(e)} }>
                    <div className="row">
                        <label>
                            First Name:
                            <input type="text" value={ this.props.payload.firstName } onChange={(e) => { this.handleTextChange(e, "firstName") }} />
                        </label>
                    </div>
                    <div className="row">
                        <label>
                            Last Name:
                            <input type="text" name="lastName" value={ this.props.payload.lastName} onChange={(e) => { this.handleTextChange(e, "lastName") }} />
                        </label>
                    </div>
                    <input type="submit" value={ this.state.isUpdating ? "Update this User" : "Create This User"} />
                </form>
                { this.state.createdUser && <div>Successfully created user </div>}
            </div>
        );
    }
}

CreateUserForm.propTypes = {
    payload: PropTypes.objectOf(PropTypes.string)
};


const ConnectedCreateUserForm = compose(
    graphql(createUserQuery, { 
        name: 'createUser'
    }),
    connect( 
        state => ({ payload: state.forms.createUserForm }),
        { 
            resetForm: formName => resetForm({ form: formName }),
            updateForm: updatedData => updateForm(updatedData)
        }
    )
)(CreateUserForm);

export default ConnectedCreateUserForm