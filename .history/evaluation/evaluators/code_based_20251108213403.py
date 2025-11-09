"""
Custom Code-based Evaluators
=============================

These evaluators use deterministic logic to evaluate specific aspects
of the system's responses.
"""

class ResponseTimeEvaluator:
    """
    Evaluates if API response time is within acceptable limits.
    
    Business Rule: Response time should be < 2 seconds for good UX
    """
    
    def __init__(self, max_response_time: float = 2.0):
        """
        Initialize the evaluator.
        
        Args:
            max_response_time: Maximum acceptable response time in seconds
        """
        self.max_response_time = max_response_time
    
    def __call__(self, *, response_time: float, **kwargs):
        """
        Evaluate response time.
        
        Args:
            response_time: The actual response time in seconds
            
        Returns:
            Dictionary with evaluation results
        """
        is_acceptable = response_time <= self.max_response_time
        score = 1.0 if is_acceptable else 0.0
        
        return {
            "response_time_score": score,
            "response_time_ms": response_time * 1000,
            "is_acceptable": is_acceptable,
            "threshold_ms": self.max_response_time * 1000
        }


class PriceAccuracyEvaluator:
    """
    Evaluates pricing accuracy by comparing calculated price with ground truth.
    
    Business Rule: Price should be within 5% margin of error
    """
    
    def __init__(self, margin_percent: float = 5.0):
        """
        Initialize the evaluator.
        
        Args:
            margin_percent: Acceptable margin of error as percentage
        """
        self.margin_percent = margin_percent
    
    def __call__(self, *, calculated_price: float, ground_truth_price: float, **kwargs):
        """
        Evaluate price accuracy.
        
        Args:
            calculated_price: Price calculated by the system
            ground_truth_price: Actual/correct price
            
        Returns:
            Dictionary with evaluation results
        """
        if ground_truth_price == 0:
            return {
                "price_accuracy_score": 0.0,
                "error_percentage": 100.0,
                "is_accurate": False,
                "error_message": "Ground truth price is zero"
            }
        
        error = abs(calculated_price - ground_truth_price)
        error_percentage = (error / ground_truth_price) * 100
        is_accurate = error_percentage <= self.margin_percent
        
        # Calculate score (linear decay from 1.0 to 0.0 as error increases)
        score = max(0.0, 1.0 - (error_percentage / 100.0))
        
        return {
            "price_accuracy_score": score,
            "calculated_price": calculated_price,
            "ground_truth_price": ground_truth_price,
            "error_percentage": round(error_percentage, 2),
            "is_accurate": is_accurate,
            "margin_threshold": self.margin_percent
        }


class RouteOptimalityEvaluator:
    """
    Evaluates if suggested route is optimal compared to ground truth.
    
    Business Rule: Route distance should not exceed optimal route by more than 10%
    """
    
    def __init__(self, max_deviation_percent: float = 10.0):
        """
        Initialize the evaluator.
        
        Args:
            max_deviation_percent: Maximum acceptable deviation percentage
        """
        self.max_deviation_percent = max_deviation_percent
    
    def __call__(self, *, suggested_distance: float, optimal_distance: float, **kwargs):
        """
        Evaluate route optimality.
        
        Args:
            suggested_distance: Distance of suggested route in km
            optimal_distance: Distance of optimal route in km
            
        Returns:
            Dictionary with evaluation results
        """
        if optimal_distance == 0:
            return {
                "route_optimality_score": 0.0,
                "deviation_percentage": 100.0,
                "is_optimal": False,
                "error_message": "Optimal distance is zero"
            }
        
        deviation = suggested_distance - optimal_distance
        deviation_percentage = (deviation / optimal_distance) * 100
        is_optimal = deviation_percentage <= self.max_deviation_percent
        
        # Calculate score
        if deviation <= 0:
            score = 1.0  # Suggested route is better or equal
        else:
            score = max(0.0, 1.0 - (deviation_percentage / 100.0))
        
        return {
            "route_optimality_score": score,
            "suggested_distance_km": suggested_distance,
            "optimal_distance_km": optimal_distance,
            "deviation_percentage": round(deviation_percentage, 2),
            "is_optimal": is_optimal,
            "threshold_percentage": self.max_deviation_percent
        }


class DataCompletenessEvaluator:
    """
    Evaluates if required fields are present in the response.
    
    Business Rule: All required fields must be present
    """
    
    def __init__(self, required_fields: list[str]):
        """
        Initialize the evaluator.
        
        Args:
            required_fields: List of required field names
        """
        self.required_fields = required_fields
    
    def __call__(self, *, response_data: dict, **kwargs):
        """
        Evaluate data completeness.
        
        Args:
            response_data: Dictionary containing response data
            
        Returns:
            Dictionary with evaluation results
        """
        missing_fields = []
        present_fields = []
        
        for field in self.required_fields:
            if field in response_data and response_data[field] is not None:
                present_fields.append(field)
            else:
                missing_fields.append(field)
        
        completeness_ratio = len(present_fields) / len(self.required_fields)
        
        return {
            "data_completeness_score": completeness_ratio,
            "total_required_fields": len(self.required_fields),
            "present_fields_count": len(present_fields),
            "missing_fields_count": len(missing_fields),
            "missing_fields": missing_fields,
            "is_complete": len(missing_fields) == 0
        }
