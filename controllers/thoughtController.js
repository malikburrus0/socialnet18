const { User, Thought } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status().json(err));
  },
  getThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { runValidators: true, new: true }
        );
      })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json({ message: "Thought has been deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json({ message: "Reaction has been deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },
};