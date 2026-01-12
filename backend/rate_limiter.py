"""
Simple in-memory rate limiter for API endpoints.
"""
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from typing import Dict, Tuple
import threading

class RateLimiter:
    """
    Thread-safe in-memory rate limiter.
    Tracks request counts per IP address with sliding window.
    """
    
    def __init__(self, max_requests: int = 5, window_seconds: int = 300):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum requests allowed in the time window
            window_seconds: Time window in seconds (default: 5 minutes)
        """
        self.max_requests = max_requests
        self.window = timedelta(seconds=window_seconds)
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = threading.Lock()
    
    def is_allowed(self, identifier: str) -> Tuple[bool, int]:
        """
        Check if request is allowed for given identifier.
        
        Args:
            identifier: Unique identifier (e.g., IP address)
            
        Returns:
            Tuple of (is_allowed, remaining_attempts)
        """
        with self.lock:
            now = datetime.now(timezone.utc)
            cutoff = now - self.window
            
            # Remove old requests outside the window
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if req_time > cutoff
            ]
            
            # Check if limit exceeded
            if len(self.requests[identifier]) >= self.max_requests:
                return False, 0
            
            # Add current request
            self.requests[identifier].append(now)
            remaining = self.max_requests - len(self.requests[identifier])
            return True, remaining
    
    def cleanup_old_entries(self):
        """Remove old entries to prevent memory bloat."""
        with self.lock:
            now = datetime.now(timezone.utc)
            cutoff = now - self.window
            
            # Remove identifiers with no recent requests
            to_remove = []
            for identifier, requests in self.requests.items():
                valid_requests = [req for req in requests if req > cutoff]
                if not valid_requests:
                    to_remove.append(identifier)
                else:
                    self.requests[identifier] = valid_requests
            
            for identifier in to_remove:
                del self.requests[identifier]

# Global rate limiters for different endpoints
login_limiter = RateLimiter(max_requests=5, window_seconds=300)  # 5 attempts per 5 minutes
