import React, { Component } from 'react';
import styled from 'styled-components';
import firebase from '../../Firebase';

class Table extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: '',
        }

        this.getTableData();
    }

    getTableData() {
        const db = firebase.firestore();

        const gameRef = db.collection('games');

        gameRef.where('white', '==', this.props.userID).get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                this.setState(state => ({
                    data: doc.data()
                }));
            } else {
                console.log("No such document! xd");
            }
        }.bind(this)).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    render(){

        const Table = styled.table`
            width: 100%;
        `;

        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>{this.props.userID}</th>
                            <th>Winner</th>
                            <th>Opponent</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td>ids will go here when i deal with loading times</td>
                            <td>{this.state.data.black}</td>
                            <td>{this.state.data.white}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default Table;