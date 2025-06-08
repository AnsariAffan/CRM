


import {supabase} from '../integration/supabase/client'
export const logActivity = async (action: string, resource: string, details?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user for activity logging');
      return;
    }

    // Get user's IP address and user agent
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase
      .from('system_logs')
      .insert({
        user_id: user.id,
        action: action,
        resource: resource,
        details: details || null,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log activity:', error);
    } else {
      console.log('Activity logged successfully:', { action, resource, details });
    }
  } catch (error) {
    console.error('Error in activity logging:', error);
  }
};

export const logLoginAttempt = async (success: boolean, location?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user for login logging');
      return;
    }

    const userAgent = navigator.userAgent;
    
    const { error } = await supabase
      .from('login_history')
      .insert({
        user_id: user.id,
        login_time: new Date().toISOString(),
        success: success,
        user_agent: userAgent,
        location: location || 'Unknown'
      });

    if (error) {
      console.error('Failed to log login attempt:', error);
    } else {
      console.log('Login attempt logged successfully:', { success, location });
    }
  } catch (error) {
    console.error('Error in login logging:', error);
  }
};
