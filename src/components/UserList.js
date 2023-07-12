import React from "react";


function UserList() {
  const userList = ['user1', 'user2', 'user3', 'user4']
  const userMap = new Map;
  userList.forEach(()=>{

  })
  userMap.set("user1", 1);


  const user = userList.map((name) => <div>{name}</div>);
  return (
    <>
      <div>my userList</div>
      <div className="userList">
        {user}
      </div>
    </>
  )
}

export default UserList;