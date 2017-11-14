import React from 'react'
import {
  Link,
} from 'react-router-dom'
import { graphql } from  'react-apollo';
import gql from 'graphql-tag';


class Home extends React.PureComponent {
  render() {
    
    if (this.props.data.loading) {
      return (
        <div>
          <p>Home Component</p>
          <p>Loading...</p>
        </div>
      )
    } else {
      var usersToRender = this.props.data.allUsers.map(function(userData) {
        return (
          <li key={userData.id}><Link to={ '/show/' + userData.id }>{ userData.firstName + " " + userData.lastName }</Link></li>
        );
      });
      return (
        <div>
          <p>Home Component</p>
          <Link to="about">
            Link to about
          </Link>
          <div style={{ height: '1px', width: '500px', marginTop: '5px' , border: '1px dashed' }}></div>
          <h3>Users:</h3>
          <ul>{usersToRender}</ul>
          <div style={{ height: '1px', width: '500px', marginTop: '5px' , border: '1px dashed' }}></div>
          <Link to="create"> Create a new User </Link>
        </div>
      )
    }
  }
}

const usersQuery = gql`
query allUsersQuery {
  allUsers {
    id
    firstName
    lastName
  }
}
`;

//todo: need to optimistically update the UI when adding a new user so the cache updates (aka don't require a full refresh to see the new user)

const HomeWithData = graphql(usersQuery)(Home);

export default HomeWithData;
