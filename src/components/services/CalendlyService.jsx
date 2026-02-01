import { supabase } from './supabaseClient';

export const syncSessions = async (calendlyData) => {
    // 1. Get the user ID once at the top
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  const token = import.meta.env.VITE_CALENDLY_ACCESS_TOKEN;
  const finalSessions = [];

//   if (!userId) {
//     console.error("No user found. Please log in.");
//     return;
//   }
//   if (!calendlyData || calendlyData.length === 0) return;

for(const session of calendlyData) {
   try {
      // 1. Fetch the invitee (student) details for this specific session
      const inviteeRes = await fetch(`${session.uri}/invitees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const inviteeJson = await inviteeRes.json();
      
      // 2. Get the name from the first invitee in the list
      const studentName = inviteeJson.collection?.[0]?.name || "New Student";

      const dateObj = new Date(session.start_time);
      const dateStr = dateObj.toLocaleDateString('en-CA');

      finalSessions.push({
        calendly_uri: session.uri,
        event_name: session.name, // "60 Minute Meeting"
        start_time: session.start_time,
        student_name: studentName, // ✅ "John Doe"
        date_string: dateStr,
        user_id: userId
      });
    } catch (err) {
      console.error("Error fetching student name for session:", session.uri, err);
    }
  }


//   const formattedForSupabase = calendlyData.map(session => {
//     const dateObj = new Date(session.start_time);
//     const dateStr = dateObj.toISOString().split('T')[0];

//  const studentName = 
//   // 1. Try to find the name in the invitees list (if it exists)
//   session.invitees?.[0]?.name || 
//   // 2. Try to split the event name: "John Doe and Jane Smith" -> "John Doe"
//   session.name.split(' and ')[0] || 
//   "Student";

//     return {
//       calendly_uri: session.uri,
//       event_name: session.name,
//       start_time: session.start_time,
//       student_name: studentName,
//       date_string: dateStr,
//       user_id: userId 
//     };
//   });

  const { data, error } = await supabase
    .from('sessions')
    .upsert(finalSessions, { onConflict: 'calendly_uri' });

  if (error) {
    console.error("Sync Error:", error);
    throw error;
  }
  return data;
};
