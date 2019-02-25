import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import firebase from '../../Firebase';
import Spinner from '../../Spinner';
import { withRouter } from 'react-router-dom';

class Table extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            whiteData: [],
            blackData: [],
            whiteLoaded: false,
            blackLoaded: false,
        }

        this.getTableData();
    }

    getTableData() {
        const db = firebase.firestore();
        const gameRef = db.collection('games');

        const userID = this.props.location.pathname.split('/')[2];

        gameRef.where('white', '==', userID).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var data = doc.data()
                data.id = doc.id;
                data.playing = 'white';
                data.win = data.winner;
                console.log("Document data:", data);
                this.setState(prevState => ({
                    whiteData: [...prevState.whiteData, data],
                    whiteLoaded: true,
                }));
            }.bind(this));
        }.bind(this)).catch(function(error) {
            console.log("Error getting document:", error);
            this.setState( state => ({
                whiteLoaded: true,
            }))
        }.bind(this));
        gameRef.where('black', '==', userID).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var data = doc.data()
                data.id = doc.id;
                data.playing = 'black';
                data.win = !data.winner;
                console.log("Document data:", data);
                this.setState(prevState => ({
                    blackData: [...prevState.blackData, data],
                    blackLoaded: true,
                }));
            }.bind(this));
        }.bind(this)).catch(function(error) {
            console.log("Error getting document:", error);
            this.setState( state => ({
                blackLoaded: true,
            }))
        });
    }

    render(){

        const { match, location, history } = this.props;

        const userID = location.pathname.split('/')[2];

        const Table = styled.table`
            width: 100%;
            color: rgb(26, 55, 82);

            border: 2px solid rgb(40, 86, 129);
            border-radius: 15px;
            border-collapse: collapse;

            thead {
                background-color: rgb(40, 86, 129);
                color: #f3d19f;
                
                th {
                    padding: 15px 0px 15px 0px;
                }
            }

            tbody tr:nth-child(even) {
                background-color: rgba(113, 126, 150, 0.5);
            }


            td {
                text-align: center;
            }
            
            .link {
                color: rgb(26, 55, 82);
                text-decoration: none;
            }
        `;



        return (
            <div>
                {this.state.whiteLoaded && this.state.blackLoaded ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Game ID</th>
                                <th>Win/Lose</th>
                                <th>Playing as</th>
                                <th>Opponent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.blackData.concat(this.state.whiteData)
                                .sort(function(a,b){return b.time - a.time})
                                .map((row, index) => (
                                    <tr>
                                        <td>
                                            {row.id}
                                        </td>
                                        <td>
                                            {row.win ? 'Win' : 'Lose'}
                                        </td>
                                        <td>
                                            {row.playing}
                                        </td>
                                        <td>
                                            {/* <Link to={row.black === userID ? row.white : row.black} className='link'> */}
                                            {row.black === userID ? row.white : row.black}
                                            {/* </Link> */}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                : <Spinner />}
            </div>
        );
    }

}

export default withRouter(Table);