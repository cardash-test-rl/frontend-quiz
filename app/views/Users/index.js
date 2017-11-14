import React from 'react'


class User extends React.Component {
    render() {

        return (
            <div>
                <p> Id: { this.props.match.params.userId }</p>
            </div>
        )
    }
}


export default User;