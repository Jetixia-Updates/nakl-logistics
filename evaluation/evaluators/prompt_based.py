"""
Custom Prompt-based Evaluators
===============================

These evaluators use LLMs to evaluate subjective aspects
of the system's responses.
"""

import json
from promptflow.client import load_flow


class CustomerServiceQualityEvaluator:
    """
    Evaluates the quality of customer service responses in Arabic.
    Uses LLM to assess professionalism, clarity, completeness, accuracy, and language.
    """
    
    def __init__(self, model_config):
        """
        Initialize the evaluator with model configuration.
        
        Args:
            model_config: OpenAIModelConfiguration or AzureOpenAIModelConfiguration
        """
        self._flow = load_flow(
            source="evaluators/customer_service_quality.prompty",
            model={"configuration": model_config}
        )
    
    def __call__(self, *, query: str, response: str, **kwargs):
        """
        Evaluate customer service response quality.
        
        Args:
            query: Customer's query/question
            response: System's response to the query
            
        Returns:
            Dictionary with evaluation results
        """
        llm_response = self._flow(query=query, response=response)
        
        try:
            result = json.loads(llm_response)
        except json.JSONDecodeError:
            result = {
                "score": 0,
                "reasoning": f"Failed to parse LLM response: {llm_response}"
            }
        
        return {
            "customer_service_quality_score": result.get("score", 0),
            "customer_service_quality_reasoning": result.get("reasoning", "")
        }


class PricingJustificationEvaluator:
    """
    Evaluates if pricing explanations are clear and well-justified.
    Uses LLM to assess transparency and customer-friendliness.
    """
    
    def __init__(self, model_config):
        """
        Initialize the evaluator with model configuration.
        
        Args:
            model_config: OpenAIModelConfiguration or AzureOpenAIModelConfiguration
        """
        self._flow = load_flow(
            source="evaluators/pricing_justification.prompty",
            model={"configuration": model_config}
        )
    
    def __call__(self, *, query: str, price_explanation: str, **kwargs):
        """
        Evaluate pricing explanation quality.
        
        Args:
            query: Customer's pricing query
            price_explanation: System's price explanation
            
        Returns:
            Dictionary with evaluation results
        """
        llm_response = self._flow(query=query, price_explanation=price_explanation)
        
        try:
            result = json.loads(llm_response)
        except json.JSONDecodeError:
            result = {
                "score": 0,
                "reasoning": f"Failed to parse LLM response: {llm_response}"
            }
        
        return {
            "pricing_justification_score": result.get("score", 0),
            "pricing_justification_reasoning": result.get("reasoning", "")
        }
