"""
Main Evaluation Runner
======================

This script runs comprehensive evaluations on the Nakl Logistics system.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from azure.ai.evaluation import evaluate, RelevanceEvaluator, CoherenceEvaluator
from azure.ai.evaluation import AzureOpenAIModelConfiguration, OpenAIModelConfiguration
from evaluators.code_based import (
    ResponseTimeEvaluator,
    PriceAccuracyEvaluator,
    RouteOptimalityEvaluator,
    DataCompletenessEvaluator
)
from evaluators.prompt_based import (
    CustomerServiceQualityEvaluator,
    PricingJustificationEvaluator
)

# Load environment variables
load_dotenv()

def get_model_config():
    """
    Get model configuration from environment variables.
    Supports both Azure OpenAI and OpenAI.
    """
    # Try Azure OpenAI first
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    if azure_endpoint:
        return AzureOpenAIModelConfiguration(
            azure_endpoint=azure_endpoint,
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-08-01-preview")
        )
    
    # Fall back to OpenAI
    return OpenAIModelConfiguration(
        type="openai",
        model=os.getenv("OPENAI_MODEL", "gpt-4"),
        base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        api_key=os.getenv("OPENAI_API_KEY")
    )


def evaluate_customer_support():
    """
    Evaluate customer support responses.
    """
    print("\n" + "="*60)
    print("EVALUATING CUSTOMER SUPPORT RESPONSES")
    print("="*60 + "\n")
    
    model_config = get_model_config()
    
    # Initialize evaluators
    evaluators = {
        # Built-in evaluators
        "relevance": RelevanceEvaluator(model_config=model_config),
        "coherence": CoherenceEvaluator(model_config=model_config),
        
        # Custom code-based evaluators
        "response_time": ResponseTimeEvaluator(max_response_time=2.0),
        "data_completeness": DataCompletenessEvaluator(
            required_fields=["response", "timestamp", "agent_id"]
        ),
        
        # Custom prompt-based evaluators
        "service_quality": CustomerServiceQualityEvaluator(model_config=model_config)
    }
    
    # Configure column mappings
    evaluator_config = {
        "relevance": {
            "column_mapping": {
                "query": "${data.customer_query}",
                "response": "${data.agent_response}"
            }
        },
        "coherence": {
            "column_mapping": {
                "query": "${data.customer_query}",
                "response": "${data.agent_response}"
            }
        },
        "response_time": {
            "column_mapping": {
                "response_time": "${data.response_time_seconds}"
            }
        },
        "data_completeness": {
            "column_mapping": {
                "response_data": "${data}"
            }
        },
        "service_quality": {
            "column_mapping": {
                "query": "${data.customer_query}",
                "response": "${data.agent_response}"
            }
        }
    }
    
    # Run evaluation
    output_path = Path(os.getenv("EVALUATION_OUTPUT_PATH", "./evaluation_results"))
    output_path.mkdir(parents=True, exist_ok=True)
    
    result = evaluate(
        data="data/customer_support_samples.jsonl",
        evaluators=evaluators,
        evaluator_config=evaluator_config,
        output_path=str(output_path / "customer_support_evaluation")
    )
    
    print("\n✅ Customer Support Evaluation Complete!")
    print(f"📊 Results saved to: {output_path / 'customer_support_evaluation'}")
    print("\n📈 Aggregate Metrics:")
    print("-" * 60)
    
    # Display metrics
    if hasattr(result, 'metrics'):
        for metric_name, value in result.metrics.items():
            if isinstance(value, (int, float)):
                print(f"  {metric_name}: {value:.3f}")
            else:
                print(f"  {metric_name}: {value}")
    
    return result


def evaluate_pricing_system():
    """
    Evaluate pricing calculation and explanation system.
    """
    print("\n" + "="*60)
    print("EVALUATING PRICING SYSTEM")
    print("="*60 + "\n")
    
    model_config = get_model_config()
    
    # Initialize evaluators
    evaluators = {
        # Custom code-based evaluators
        "price_accuracy": PriceAccuracyEvaluator(margin_percent=5.0),
        
        # Custom prompt-based evaluators
        "pricing_justification": PricingJustificationEvaluator(model_config=model_config)
    }
    
    # Configure column mappings
    evaluator_config = {
        "price_accuracy": {
            "column_mapping": {
                "calculated_price": "${data.system_calculated_price}",
                "ground_truth_price": "${data.actual_price}"
            }
        },
        "pricing_justification": {
            "column_mapping": {
                "query": "${data.customer_query}",
                "price_explanation": "${data.price_explanation}"
            }
        }
    }
    
    # Run evaluation
    output_path = Path(os.getenv("EVALUATION_OUTPUT_PATH", "./evaluation_results"))
    output_path.mkdir(parents=True, exist_ok=True)
    
    result = evaluate(
        data="data/pricing_samples.jsonl",
        evaluators=evaluators,
        evaluator_config=evaluator_config,
        output_path=str(output_path / "pricing_evaluation")
    )
    
    print("\n✅ Pricing System Evaluation Complete!")
    print(f"📊 Results saved to: {output_path / 'pricing_evaluation'}")
    print("\n📈 Aggregate Metrics:")
    print("-" * 60)
    
    # Display metrics
    if hasattr(result, 'metrics'):
        for metric_name, value in result.metrics.items():
            if isinstance(value, (int, float)):
                print(f"  {metric_name}: {value:.3f}")
            else:
                print(f"  {metric_name}: {value}")
    
    return result


def evaluate_route_optimization():
    """
    Evaluate route optimization suggestions.
    """
    print("\n" + "="*60)
    print("EVALUATING ROUTE OPTIMIZATION")
    print("="*60 + "\n")
    
    # Initialize evaluators
    evaluators = {
        "route_optimality": RouteOptimalityEvaluator(max_deviation_percent=10.0)
    }
    
    # Configure column mappings
    evaluator_config = {
        "route_optimality": {
            "column_mapping": {
                "suggested_distance": "${data.suggested_route_distance_km}",
                "optimal_distance": "${data.optimal_route_distance_km}"
            }
        }
    }
    
    # Run evaluation
    output_path = Path(os.getenv("EVALUATION_OUTPUT_PATH", "./evaluation_results"))
    output_path.mkdir(parents=True, exist_ok=True)
    
    result = evaluate(
        data="data/route_optimization_samples.jsonl",
        evaluators=evaluators,
        evaluator_config=evaluator_config,
        output_path=str(output_path / "route_optimization_evaluation")
    )
    
    print("\n✅ Route Optimization Evaluation Complete!")
    print(f"📊 Results saved to: {output_path / 'route_optimization_evaluation'}")
    print("\n📈 Aggregate Metrics:")
    print("-" * 60)
    
    # Display metrics
    if hasattr(result, 'metrics'):
        for metric_name, value in result.metrics.items():
            if isinstance(value, (int, float)):
                print(f"  {metric_name}: {value:.3f}")
            else:
                print(f"  {metric_name}: {value}")
    
    return result


def main():
    """
    Run all evaluations.
    """
    print("\n" + "="*70)
    print("  NAKL LOGISTICS - COMPREHENSIVE EVALUATION FRAMEWORK")
    print("="*70)
    
    # Check environment
    if not os.getenv("AZURE_OPENAI_ENDPOINT") and not os.getenv("OPENAI_API_KEY"):
        print("\n⚠️  Warning: No API keys configured!")
        print("Please set up your environment variables in .env file")
        print("See .env.example for required variables")
        return
    
    results = {}
    
    # Run evaluations if data files exist
    if Path("data/customer_support_samples.jsonl").exists():
        results["customer_support"] = evaluate_customer_support()
    else:
        print("\n⚠️  Skipping customer support evaluation (data file not found)")
    
    if Path("data/pricing_samples.jsonl").exists():
        results["pricing"] = evaluate_pricing_system()
    else:
        print("\n⚠️  Skipping pricing evaluation (data file not found)")
    
    if Path("data/route_optimization_samples.jsonl").exists():
        results["route_optimization"] = evaluate_route_optimization()
    else:
        print("\n⚠️  Skipping route optimization evaluation (data file not found)")
    
    # Summary
    print("\n" + "="*70)
    print("  EVALUATION SUMMARY")
    print("="*70)
    print(f"\n✅ Completed {len(results)} evaluation(s)")
    print(f"📁 Results directory: {os.getenv('EVALUATION_OUTPUT_PATH', './evaluation_results')}")
    print("\n💡 Tip: Review the detailed results in the output directory")
    print("   Each evaluation includes:")
    print("   - Row-level scores and reasoning")
    print("   - Aggregate metrics and statistics")
    print("   - Visualizations and charts")
    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    main()
