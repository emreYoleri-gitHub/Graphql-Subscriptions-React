import { gql, useSubscription } from "@apollo/client";
import { useState } from "react";
const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageCreated {
    messageCreated {
      text
      createdBy
    }
  }
`;
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
    onSubscriptionData: (data) => {
      const message = data.subscriptionData.data.messageCreated;
      setMessages([...messages, message]);
    },
  });

  return (
    <div>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{ border: "1px solid black", marginTop: 20, marginBottom: 20 }}
        >
          <h2>Message - {i + 1}</h2>
          <p>Text: {msg.text}</p>
          <p>Created By: {msg.createdBy}</p>
        </div>
      ))}
    </div>
  );
};

export default Messages;
