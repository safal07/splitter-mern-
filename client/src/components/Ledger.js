import React, { Component} from 'react';
import {Redirect} from 'react-router';
import {connect} from 'react-redux';
import {logout} from '../actions/authActions';
import {addMember, deleteLedger} from '../actions/ledgerActions';
import {Link} from 'react-router-dom';
import {showEntryForm, fetchEntries, deleteEntry} from '../actions/entryActions';

import EntryForm from './EntryForm';


function mapStateToProps(state) {
  return({
    auth: state.auth,
    ledgers: state.ledgers,
    entry: state.entry,
    errors: state.errors
  });
}

function mapDispatchToProps(dispatch) {
  return({
    logoutUser: () => {
      dispatch(logout());
    },
    deleteUserLedger: (ledger) => {
      dispatch(deleteLedger(ledger));
    },
    addMemberToLedger: (member) => {
      dispatch(addMember(member));
    },
    fetchUserEntriese: (ledgerid) => {
      dispatch(fetchEntries(ledgerid));
    },
    showEntryForm: () => {
      dispatch(showEntryForm());
    },
    deleteUserEntry: (entry) => {
      dispatch(deleteEntry(entry));
    }
  });
}


class Ledger extends Component{
  constructor(props) {
    super(props);
      this.state = {
        entryFormShowing: false,
        memberEmail: ""
      }
  }
  componentDidMount() {
    this.props.fetchUserEntriese(this.props.ledgers.currentLedger._id);
  }


  deleteLedger = (e) => {
    this.props.deleteUserLedger(this.props.ledgers.currentLedger);
  }


  handleMemberEmailChange = (e) => {
    this.setState({
      memberEmail: e.target.value
    });
  }

  addMember = (e) => {
    let member = {
      member_email: this.state.memberEmail,
      ledger_id: this.props.ledgers.currentLedger._id
    }
    this.props.addMemberToLedger(member);
  }

  deleteEntry = (entry) => {
      this.props.deleteUserEntry(
        {
          _id: entry._id,
          key: entry.key,
          creator_id: entry.creator._id,
          ledger_id: this.props.ledgers.currentLedger._id
        }
      );
  }

  render() {
    const userEntries = this.props.entry.userEntries.map((item, index) => {
      let d = new Date(item.dateOfExpense);
      item.key = index;

      return (
        <tr key = {index} align = "center">
          <td>{item.creator.firstname}</td>
          <td>{item.descriptionOfExpense}</td>
          <td>{d.toDateString()}</td>
          <td>{item.amountofExpense}</td>
          <td>

            <button className = "trash_btn" onClick = {() => this.deleteEntry(item)} disabled ={item.creator._id === this.props.auth.loggedinUser.userid ? "" : "disabled"}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </td>
        </tr>);
    });

    if(this.props.auth.authenticated) {
      if (this.props.ledgers.currentLedger) {
        return(
          <div>
            <input type = "email" onChange = {this.handleMemberEmailChange} name = "email" value = {this.state.memberEmail}/>
            <button onClick = {this.addMember}> Add members </button><br/>
            <button onClick = {this.props.showEntryForm}> Add entry </button>
            <button onClick = {this.deleteLedger} disabled ={this.props.ledgers.currentLedger.creator._id === this.props.auth.loggedinUser.userid ? "" : "disabled"} > Delete </button>
            <EntryForm />
            <table align = "center">
              <tbody>
                <tr>
                  <th>Creator</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Config</th>
                </tr>
                {userEntries}
              </tbody>
            </table>
          </div>

        );
      }
      else {
        return(<Redirect to={{
              pathname: '/dashboard',
          }}
        />);
      }
    }
    else {
      console.log("test");
      return(<Redirect to={{
            pathname: '/',
        }}
      />);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ledger);;
