import mongoose from "mongoose";

//create schema


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    // required: true
  }
  ,
  lastName: {
    type: String,
    // required: true
  },
  googleId: {
    type: String
  },
  picture: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
    minLength: 6
  }
  ,
  profilePic: {
    type: String,
    default: ""
  }
  ,
  //initially as empty during sign up
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  ],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  ]
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema);
export { User };