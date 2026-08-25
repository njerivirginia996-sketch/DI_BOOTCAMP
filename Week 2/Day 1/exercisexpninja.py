class Phone:

    def __init__(self, phone_number):
        self.phone_number = phone_number
        self.call_history = []
        self.messages = []

    def call(self, other_phone):
        """Simulates making a call to another Phone object."""
        call_info = f"{self.phone_number} called {other_phone.phone_number}"
        print(call_info)

        # Record call in caller's history
        self.call_history.append(call_info)

    def show_call_history(self):
        """Prints the history of all calls made."""
        print(f"\n--- Call History for {self.phone_number} ---")
        if not self.call_history:
            print("No call history.")
        for record in self.call_history:
            print(record)

    def send_message(self, other_phone, content):
        """Sends a text message to another Phone object and records it on both phones."""
        message_data = {
            "to": other_phone.phone_number,
            "from": self.phone_number,
            "content": content,
        }

        # Store message in both sender and recipient history
        self.messages.append(message_data)
        other_phone.messages.append(message_data)
        print(f"Message sent from {self.phone_number} to {other_phone.phone_number}.")

    def show_outgoing_messages(self):
        """Displays all messages sent by this phone."""
        print(f"\n--- Outgoing Messages from {self.phone_number} ---")
        outgoing = [
            msg for msg in self.messages if msg["from"] == self.phone_number
        ]
        if not outgoing:
            print("No outgoing messages.")
        for msg in outgoing:
            print(f"To {msg['to']}: {msg['content']}")

    def show_incoming_messages(self):
        """Displays all messages received by this phone."""
        print(f"\n--- Incoming Messages for {self.phone_number} ---")
        incoming = [
            msg for msg in self.messages if msg["to"] == self.phone_number
        ]
        if not incoming:
            print("No incoming messages.")
        for msg in incoming:
            print(f"From {msg['from']}: {msg['content']}")

    def show_messages_from(self, other_phone):
        """Displays messages received from a specific phone number or object."""
        target_number = (
            other_phone.phone_number
            if isinstance(other_phone, Phone)
            else other_phone
        )
        print(
            f"\n--- Messages on {self.phone_number} from {target_number} ---"
        )
        filtered = [
            msg for msg in self.messages if msg["from"] == target_number
        ]
        if not filtered:
            print(f"No messages from {target_number}.")
        for msg in filtered:
            print(f"Content: {msg['content']}")


# ==================== Testing the Code ====================
if __name__ == "__main__":
    # Create phone instances
    phone_a = Phone("+1-555-0101")
    phone_b = Phone("+1-555-0202")

    # Test call functionality
    phone_a.call(phone_b)
    phone_a.show_call_history()

    # Test message functionality
    phone_a.send_message(
        phone_b, "Hey! Are we still meeting for lunch today?"
    )
    phone_b.send_message(phone_a, "Yes! See you at 1 PM.")

    # View sent and received messages
    phone_a.show_outgoing_messages()
    phone_a.show_incoming_messages()

    # View messages from a specific phone
    phone_b.show_messages_from(phone_a)