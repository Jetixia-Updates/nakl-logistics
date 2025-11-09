# Nakl Logistics - Evaluation Framework

## Overview

This evaluation framework provides comprehensive testing and quality assurance for AI-powered features in the Nakl Logistics system.

## Features

### ✅ Built-in Evaluators (Azure AI Evaluation SDK)
- **RelevanceEvaluator**: Evaluates if responses are relevant to queries
- **CoherenceEvaluator**: Assesses response clarity and flow

### 🔧 Custom Code-based Evaluators
- **ResponseTimeEvaluator**: Ensures API responses are fast enough
- **PriceAccuracyEvaluator**: Validates pricing calculations
- **RouteOptimalityEvaluator**: Checks route optimization quality
- **DataCompletenessEvaluator**: Verifies all required fields are present

### 🤖 Custom Prompt-based Evaluators (LLM as Judge)
- **CustomerServiceQualityEvaluator**: Evaluates Arabic customer service responses
- **PricingJustificationEvaluator**: Assesses pricing explanation quality

## Setup

### 1. Install Dependencies

```bash
cd evaluation
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**For Azure OpenAI:**
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-08-01-preview
```

**Or for OpenAI:**
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4
```

### 3. Prepare Test Data

Test data is provided in `data/` directory:
- `customer_support_samples.jsonl` - Customer service interactions
- `pricing_samples.jsonl` - Pricing calculations and explanations
- `route_optimization_samples.jsonl` - Route planning data

**Data Format**: All data must be in JSONL format (JSON Lines), where each line is a complete JSON object.

## Usage

### Run All Evaluations

```bash
python evaluate.py
```

### Run Specific Evaluation

Modify `evaluate.py` to comment out evaluations you don't need.

## Results

Results are saved to `./evaluation_results/` (or path specified in `.env`):

```
evaluation_results/
├── customer_support_evaluation/
│   ├── eval_results.jsonl         # Row-level results
│   ├── metrics.json                # Aggregate metrics
│   └── trace.json                  # Execution trace
├── pricing_evaluation/
│   └── ...
└── route_optimization_evaluation/
    └── ...
```

### Understanding Results

Each evaluation produces:

1. **Row-level Results** (`eval_results.jsonl`):
   - Individual scores for each test case
   - Detailed reasoning and explanations
   - All evaluator outputs

2. **Aggregate Metrics** (`metrics.json`):
   - Average scores across all test cases
   - Statistical summaries
   - Performance indicators

3. **Trace Data** (`trace.json`):
   - Execution timeline
   - API calls and responses
   - Performance metrics

## Evaluation Scenarios

### 1. Customer Support Evaluation

**What it evaluates:**
- Response relevance to customer queries
- Response coherence and clarity
- Response time performance
- Data completeness
- Service quality (Arabic language)

**Metrics:**
- `relevance_score`: 1-5 scale
- `coherence_score`: 1-5 scale
- `response_time_score`: 0 or 1 (pass/fail)
- `data_completeness_score`: 0-1 ratio
- `customer_service_quality_score`: 1-5 scale

### 2. Pricing System Evaluation

**What it evaluates:**
- Price calculation accuracy
- Pricing explanation quality and transparency

**Metrics:**
- `price_accuracy_score`: 0-1 scale
- `pricing_justification_score`: 1-5 scale
- `error_percentage`: Deviation from ground truth

### 3. Route Optimization Evaluation

**What it evaluates:**
- Route distance optimality
- Deviation from optimal routes

**Metrics:**
- `route_optimality_score`: 0-1 scale
- `deviation_percentage`: Distance deviation

## Adding Custom Evaluators

### Code-based Evaluator

```python
class MyCustomEvaluator:
    def __init__(self, threshold: float = 0.8):
        self.threshold = threshold
    
    def __call__(self, *, input_field: str, **kwargs):
        # Your evaluation logic
        score = evaluate_something(input_field)
        
        return {
            "my_metric_score": score,
            "is_acceptable": score >= self.threshold
        }
```

### Prompt-based Evaluator

1. Create a `.prompty` file in `evaluators/`:

```yaml
---
name: My Custom Evaluator
description: Evaluates something specific
model:
  api: chat
  configuration:
    type: azure_openai
  parameters:
    temperature: 0.0
    max_tokens: 800
    response_format:
      type: json_object

inputs:
  input_field:
    type: string

outputs:
  score:
    type: int
  reasoning:
    type: string
---
system:
You are an expert evaluator...

user:
Input: {{input_field}}

Respond in JSON format:
{
  "score": <score>,
  "reasoning": "<reasoning>"
}
```

2. Create Python wrapper in `evaluators/prompt_based.py`:

```python
class MyCustomEvaluator:
    def __init__(self, model_config):
        self._flow = load_flow(
            source="evaluators/my_custom.prompty",
            model={"configuration": model_config}
        )
    
    def __call__(self, *, input_field: str, **kwargs):
        llm_response = self._flow(input_field=input_field)
        result = json.loads(llm_response)
        
        return {
            "my_metric_score": result.get("score", 0),
            "my_metric_reasoning": result.get("reasoning", "")
        }
```

## Best Practices

1. **Start with Built-in Evaluators**: Always check if Azure AI Evaluation SDK has a built-in evaluator for your needs
2. **Use Code-based for Objective Metrics**: Use deterministic logic for measurable criteria
3. **Use Prompt-based for Subjective Metrics**: Use LLM judgment for subjective quality assessment
4. **Keep Test Data Current**: Regularly update test data to reflect real scenarios
5. **Review Results Manually**: Don't rely solely on automated scores; review sample results
6. **Set Appropriate Thresholds**: Adjust thresholds based on business requirements
7. **Monitor Performance**: Track evaluation metrics over time to detect regressions

## Troubleshooting

### "No API key configured"
- Make sure `.env` file exists and contains valid credentials
- Check that environment variables are loaded correctly

### "Data file not found"
- Ensure JSONL data files exist in the `data/` directory
- Check file paths in `evaluate.py`

### "Failed to parse LLM response"
- Check that your `.prompty` file specifies `response_format: type: json_object`
- Verify the LLM is returning valid JSON

### Low evaluation scores
- Review sample outputs to understand what's failing
- Check if test data represents real-world scenarios
- Adjust evaluator parameters if needed

## Integration with CI/CD

Add evaluation to your CI/CD pipeline:

```yaml
# .github/workflows/evaluation.yml
name: Run Evaluations

on:
  pull_request:
    branches: [ main ]

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd evaluation
          pip install -r requirements.txt
      
      - name: Run evaluations
        env:
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
          AZURE_OPENAI_DEPLOYMENT: ${{ secrets.AZURE_OPENAI_DEPLOYMENT }}
        run: |
          cd evaluation
          python evaluate.py
      
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: evaluation-results
          path: evaluation/evaluation_results/
```

## Resources

- [Azure AI Evaluation SDK Documentation](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/develop/evaluate-sdk)
- [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/)
- [Promptflow Documentation](https://microsoft.github.io/promptflow/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Azure AI Evaluation SDK documentation
3. Contact the development team
