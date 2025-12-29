import React, { useEffect, useState } from "react";
import axios from "../lib/axios"; // Uses your configured axios instance
import { UserPlus, Check, MessageSquare } from "lucide-react"; 

const Friends = () => {
  const [activeTab, setActiveTab] = useState("myFriends");
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "myFriends") {
          // 👇 CHANGED: Removed "/api"
          const res = await axios.get("/users/friends"); 
          setFriends(res.data);
        } else if (activeTab === "requests") {
          // 👇 CHANGED: Removed "/api"
          const res = await axios.get("/users/friend-requests"); 
          setIncomingRequests(res.data.incomingReqs); 
        } else if (activeTab === "suggestions") {
          // 👇 CHANGED: Removed "/api"
          const res = await axios.get("/users/"); 
          setRecommendations(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleSendRequest = async (userId) => {
    try {
      // 👇 CHANGED: Removed "/api"
      await axios.post(`/users/friend-request/${userId}`);
      setRecommendations((prev) => prev.filter((user) => user._id !== userId));
      alert("Friend request sent!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      // 👇 CHANGED: Removed "/api"
      await axios.put(`/users/friend-request/${requestId}/accept`);
      setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
      alert("Friend request accepted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Friends & Connections</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <TabButton isActive={activeTab === "myFriends"} onClick={() => setActiveTab("myFriends")} label="My Friends" />
        <TabButton isActive={activeTab === "requests"} onClick={() => setActiveTab("requests")} label="Requests" count={incomingRequests.length} />
        <TabButton isActive={activeTab === "suggestions"} onClick={() => setActiveTab("suggestions")} label="Find Friends" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* My Friends Tab */}
          {activeTab === "myFriends" && (
            friends.length > 0 ? (
              friends.map((friend) => (
                <UserCard key={friend._id} user={friend}>
                  <button className="btn btn-secondary w-full mt-2 flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Message
                  </button>
                </UserCard>
              ))
            ) : <p className="text-gray-500 col-span-3 text-center">You haven't added any friends yet.</p>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            incomingRequests.length > 0 ? (
              incomingRequests.map((req) => (
                <UserCard key={req._id} user={req.sender}>
                   <button onClick={() => handleAcceptRequest(req._id)} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 w-full mt-2">
                     <Check size={18} /> Accept
                   </button>
                </UserCard>
              ))
            ) : <p className="text-gray-500 col-span-3 text-center">No pending friend requests.</p>
          )}

          {/* Suggestions Tab */}
          {activeTab === "suggestions" && (
            recommendations.length > 0 ? (
              recommendations.map((user) => (
                <UserCard key={user._id} user={user}>
                  <button onClick={() => handleSendRequest(user._id)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 w-full mt-2">
                     <UserPlus size={18} /> Add Friend
                  </button>
                </UserCard>
              ))
            ) : <p className="text-gray-500 col-span-3 text-center">No new recommendations right now.</p>
          )}
        </div>
      )}
    </div>
  );
};

const TabButton = ({ isActive, onClick, label, count }) => (
  <button onClick={onClick} className={`pb-2 px-4 font-medium transition-colors ${isActive ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
    {label} {count > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{count}</span>}
  </button>
);

const UserCard = ({ user, children }) => (
  <div className="bg-base-100 p-4 rounded-lg shadow border flex flex-col items-center text-center">
    <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-16 h-16 rounded-full object-cover mb-3"/>
    <h3 className="font-semibold text-lg">{user.fullName}</h3>
    {user.nativeLanguage && <p className="text-sm text-gray-500 mb-4">{user.nativeLanguage} • {user.learningLanguage}</p>}
    <div className="w-full mt-auto">{children}</div>
  </div>
);

export default Friends;