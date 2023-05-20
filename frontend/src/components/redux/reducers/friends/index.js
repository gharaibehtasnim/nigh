import { createSlice } from "@reduxjs/toolkit";

export const friends = createSlice({
  name: "friends",

  initialState: {
    friends: [],
    isFriend: false,
    isAdded: false,
    isReceived: false,
    isRemoved: false,
    sentReq: [],
    ReceivedReq: [],
    newReq: false,
  },

  reducers: {
    getAlluserFriends: (state, action) => {
      //payload = array of user's friends
      state.friends = action.payload;
    },

    isTheUserIsFriend: (state, action) => {
      state.friends &&
        state.friends.map((element) => {
          if (element.user_id == action.payload) {
            state.isFriend = true;
          } else {
            state.isFriend = false;
          }
        });
    },

    setIsFriend: (state, action) => {
      state.isFriend = action.payload;
    },

    setIsAdded: (state, action) => {
      state.isAdded = action.payload;
    },

    setIsReceived: (state, action) => {
      state.isReceived = action.payload;
    },

    setSentReq: (state, action) => {
      state.sentReq = action.payload;
    },

    addToSentReq: (state, action) => {
      //save the sent request in the sentReq State
      state.sentReq.push(action.payload);
    },

    cancelFriendReq: (state, action) => {
      //action.payload = reciver_id
      state.sentReq.forEach((element, i) => {
        if (element.receiver_id === action.payload) {
          state.sentReq.splice(i, 1);
        }
      });
    },

    setReceivedReq: (state, action) => {
      state.ReceivedReq = action.payload;
    },

    declineFriendReq: (state, action) => {
      //action.payload = sender_id
      state.ReceivedReq.map((element, i) => {
        if (element.sender_id == action.payload) {
          state.ReceivedReq.splice(i, 1);
        }
        return element;
      });
    },

    addFriend: (state, action) => {
      state.isAdded = true;
    },

    acceptFriendRequest: (state, action) => {
      //payload= newFriend
      state.friends.push(action.payload);
    },

    removeFriend: (state, action) => {
      //payload = user_id
      state.friends.map((element, i) => {
        if (element.user_id == action.payload) {
          state.friends.splice(i, 1);
        }
        return element;
      });
    },

    setIsRemoved: (state, action) => {
      state.isRemoved = action.payload;
    },

    setNewReq: (state, action) => {
      state.newReq = action.payload;
    },
  },
});

export const {
  getAlluserFriends,
  addFriend,
  acceptFriendRequest,
  cancelFriendReq,
  declineFriendReq,
  removeFriend,
  isFriendFun,
  isTheUserIsFriend,
  setSentReq,
  setReceivedReq,
  addToSentReq,
  setIsAdded,
  setIsReceived,
  setIsFriend,
  setIsRemoved,
  setNewReq,
} = friends.actions;

export default friends.reducer;
