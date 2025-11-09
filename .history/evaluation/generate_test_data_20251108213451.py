"""
Data Generation Helper
=====================

This script helps generate test data for evaluations from your application logs
or by creating synthetic test cases.
"""

import json
import jsonlines
from pathlib import Path
from datetime import datetime
import random


def generate_customer_support_samples(output_file: str = "data/customer_support_samples.jsonl"):
    """
    Generate sample customer support interactions.
    In production, you would collect these from your actual system logs.
    """
    samples = [
        {
            "customer_query": "كم تكلفة نقل شحنة 5 طن من القاهرة إلى الإسكندرية؟",
            "agent_response": "مرحباً بك! تكلفة نقل شحنة 5 طن من القاهرة إلى الإسكندرية تتراوح بين 3,500 إلى 4,500 جنيه مصري، حسب نوع البضاعة وموعد النقل. يمكننا تقديم عرض سعر دقيق بعد معرفة تفاصيل أكثر عن نوع البضاعة وموعد النقل المطلوب. هل تريد الحصول على عرض سعر مفصل؟",
            "response_time_seconds": 1.2,
            "timestamp": "2024-01-15T10:30:00",
            "agent_id": "AGT001"
        },
        {
            "customer_query": "أين شحنتي رقم WO-2024-001234؟",
            "agent_response": "شحنتك رقم WO-2024-001234 حالياً في الطريق. آخر تحديث: الشاحنة في طريق السويس الصحراوي، متوقع الوصول خلال 3 ساعات. يمكنك تتبع الشحنة مباشرة من خلال رابط التتبع: https://nakl.com/track/WO-2024-001234",
            "response_time_seconds": 0.8,
            "timestamp": "2024-01-15T11:45:00",
            "agent_id": "AGT002"
        },
        {
            "customer_query": "هل تقدمون خدمة التخزين؟",
            "agent_response": "نعم، نوفر خدمات تخزين متكاملة في مستودعاتنا الحديثة. لدينا مستودعات مجهزة بأنظمة أمان متطورة ومراقبة على مدار الساعة. أسعار التخزين تبدأ من 50 جنيه لكل متر مكعب شهرياً. هل تحتاج لمعرفة المزيد عن خدمات التخزين؟",
            "response_time_seconds": 1.5,
            "timestamp": "2024-01-15T14:20:00",
            "agent_id": "AGT001"
        }
    ]
    
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    with jsonlines.open(output_file, mode='w') as writer:
        for sample in samples:
            writer.write(sample)
    
    print(f"✅ Generated {len(samples)} customer support samples → {output_file}")


def generate_pricing_samples(output_file: str = "data/pricing_samples.jsonl"):
    """
    Generate sample pricing calculations.
    In production, you would collect these from actual pricing requests.
    """
    samples = [
        {
            "customer_query": "كم تكلفة نقل 3 طن من القاهرة للإسكندرية؟",
            "system_calculated_price": 2800.0,
            "actual_price": 2750.0,
            "price_explanation": "التكلفة 2,800 جنيه وتشمل: (1) تكلفة النقل الأساسية: 2,000 جنيه (2) رسوم الوقود: 500 جنيه (3) رسوم الطرق: 200 جنيه (4) التأمين: 100 جنيه. المسافة 220 كم، الوزن 3 طن."
        },
        {
            "customer_query": "ما سعر التخزين لـ 50 متر مكعب لمدة شهر؟",
            "system_calculated_price": 2500.0,
            "actual_price": 2500.0,
            "price_explanation": "تكلفة التخزين 2,500 جنيه شهرياً وتشمل: (1) إيجار المساحة: 50 م³ × 40 جنيه = 2,000 جنيه (2) خدمات الأمن والمراقبة: 300 جنيه (3) خدمات الصيانة والنظافة: 200 جنيه. السعر شامل الضريبة."
        },
        {
            "customer_query": "كم تكلفة نقل شحنة مبردة 2 طن من القاهرة لأسوان؟",
            "system_calculated_price": 6500.0,
            "actual_price": 6200.0,
            "price_explanation": "التكلفة 6,500 جنيه للشحنة المبردة وتشمل: (1) النقل الأساسي: 4,000 جنيه (2) تكلفة التبريد: 1,500 جنيه (3) الوقود الإضافي: 700 جنيه (4) التأمين الخاص: 300 جنيه. المسافة 880 كم، درجة الحرارة المطلوبة: 2-8 درجة مئوية."
        }
    ]
    
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    with jsonlines.open(output_file, mode='w') as writer:
        for sample in samples:
            writer.write(sample)
    
    print(f"✅ Generated {len(samples)} pricing samples → {output_file}")


def generate_route_optimization_samples(output_file: str = "data/route_optimization_samples.jsonl"):
    """
    Generate sample route optimization data.
    In production, you would collect these from your routing system.
    """
    samples = [
        {
            "order_id": "WO-2024-001",
            "origin": "Cairo",
            "destination": "Alexandria",
            "suggested_route_distance_km": 225.0,
            "optimal_route_distance_km": 220.0,
            "route_name": "Desert Road"
        },
        {
            "order_id": "WO-2024-002",
            "origin": "Cairo",
            "destination": "Aswan",
            "suggested_route_distance_km": 890.0,
            "optimal_route_distance_km": 880.0,
            "route_name": "Nile Valley Road"
        },
        {
            "order_id": "WO-2024-003",
            "origin": "Alexandria",
            "destination": "Port Said",
            "suggested_route_distance_km": 210.0,
            "optimal_route_distance_km": 205.0,
            "route_name": "Coastal Road"
        }
    ]
    
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    with jsonlines.open(output_file, mode='w') as writer:
        for sample in samples:
            writer.write(sample)
    
    print(f"✅ Generated {len(samples)} route optimization samples → {output_file}")


def export_from_database():
    """
    Example: Export real data from your database for evaluation.
    
    This is a template - modify it to connect to your actual database.
    """
    print("\n📊 Exporting data from database...")
    print("⚠️  This is a template - modify to connect to your actual database\n")
    
    # Example: Export customer support interactions
    # query = '''
    #     SELECT 
    #         customer_query,
    #         agent_response,
    #         response_time_seconds,
    #         created_at as timestamp,
    #         agent_id
    #     FROM customer_support_logs
    #     WHERE created_at >= NOW() - INTERVAL '30 days'
    #     AND response_quality_score IS NULL  -- Not yet evaluated
    #     LIMIT 100
    # '''
    
    # Example: Export pricing calculations
    # query = '''
    #     SELECT 
    #         p.customer_query,
    #         p.calculated_price as system_calculated_price,
    #         p.final_price as actual_price,
    #         p.price_breakdown as price_explanation
    #     FROM pricing_requests p
    #     WHERE p.created_at >= NOW() - INTERVAL '30 days'
    #     LIMIT 100
    # '''
    
    print("Template code:")
    print("""
    import psycopg2
    import jsonlines
    
    # Connect to database
    conn = psycopg2.connect(
        host="your-host",
        database="nakl_logistics",
        user="your-user",
        password="your-password"
    )
    
    # Execute query
    cursor = conn.cursor()
    cursor.execute(query)
    
    # Export to JSONL
    with jsonlines.open('data/exported_data.jsonl', mode='w') as writer:
        for row in cursor.fetchall():
            writer.write({
                'field1': row[0],
                'field2': row[1],
                # ... map all fields
            })
    """)


def main():
    print("\n" + "="*60)
    print("  NAKL LOGISTICS - EVALUATION DATA GENERATOR")
    print("="*60 + "\n")
    
    print("Generating sample test data...\n")
    
    generate_customer_support_samples()
    generate_pricing_samples()
    generate_route_optimization_samples()
    
    print("\n" + "="*60)
    print("✅ Sample data generation complete!")
    print("="*60)
    print("\n💡 Next steps:")
    print("   1. Review the generated data in the 'data/' directory")
    print("   2. Modify samples to match your actual use cases")
    print("   3. Configure your API keys in .env")
    print("   4. Run: python evaluate.py")
    print("\n💡 For production:")
    print("   - Export real data from your application logs")
    print("   - Use export_from_database() as a template")
    print("   - Regularly update test data to reflect new scenarios")
    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    main()
