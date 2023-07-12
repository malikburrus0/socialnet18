const { User, Thought } = require("../models");

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user found with this ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: "User and their thoughts delete." }))
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user found with this ID" })
          : res.json({ message: "Friend has been deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },
};