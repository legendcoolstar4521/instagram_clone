import React, { useState, useEffect } from 'react'
import classes from './SearchBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../../firebase';
import FollowUser from '../../FollowUser/FollowUser';
function SearchBar({ uid }) {
    const [search, setSearch] = useState('');
    const [showSearch,setShowSearch]= useState(true)
    const [searchedAccounts, setSearchedAccounts] = useState([])
    useEffect(() => {
        setShowSearch(true);
        db.ref().child(`accounts`).on("value", snapshot => {
            let data = snapshot ? snapshot.val() : null;
            if (!data || data === 'not set') {
                return;
            }
            let values = Object.entries(data);
            let extra = [];
            values.map(value => (
                extra.push({
                    id: value[0],
                    username: value[1]
                })
            ))
            let filteredAccounts = [];
            if (search.length >= 1) {
                filteredAccounts = extra.filter(ext => {
                    return ext.username.toLowerCase().includes(search.toLowerCase());
                })
            }
            setSearchedAccounts(filteredAccounts);
        })
        return () => {
            db.ref().child(`accounts`).off();
        }
    }, [search])
    return (
        <div className={classes.SearchBar}>
            <FontAwesomeIcon icon={faSearch} color="#ccc" className={classes.SearchIcon} />
            <input className={classes.Search} type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search.length && showSearch ?<div style={{ height: '200px', width: '200px',position:'absolute',zIndex:'15',marginTop:'230px',backgroundColor:'#fafafa',overflowY:'scroll',border:'1px solid #ccc' }}>
                {
                    searchedAccounts.length  ? <div>{
                        searchedAccounts.map(account => (
                            <FollowUser key={account.id} id={account.id} uid={uid} setShowSearch={setShowSearch} />
                        ))}</div>
                        : null
                }
            </div>:null}
        </div>
    )
}

export default SearchBar
